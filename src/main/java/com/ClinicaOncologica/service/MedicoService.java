package com.ClinicaOncologica.service;

import com.ClinicaOncologica.model.Medico;
import com.ClinicaOncologica.model.Paciente;
import com.ClinicaOncologica.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteService pacienteService;

    public List<Medico> findAll() {
        return medicoRepository.findAll();
    }

    public Optional<Medico> findById(Long id) {
        return medicoRepository.findById(id);
    }

    public Medico save(Medico medico) {
        return medicoRepository.save(medico);
    }

    public void deleteById(Long id) {
        medicoRepository.deleteById(id);
    }

    public Medico update(Long id, Medico medicoDetails) {
        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medico not found with id " + id));
        medico.setNome(medicoDetails.getNome());
        medico.setCrm(medicoDetails.getCrm());
        medico.setAtivo(medicoDetails.getAtivo());
        return medicoRepository.save(medico);
    }

    // MÉTODO PARA VERIFICAR SE PODE DELETAR
    public boolean medicoPossuiPacientes(Long id) {
        Optional<Medico> medicoOpt = medicoRepository.findById(id);
        if (medicoOpt.isEmpty()) {
            throw new RuntimeException("Médico não encontrado");
        }
        return !medicoOpt.get().podeSerExcluido();
    }

    // MÉTODO PARA OBTER PACIENTES DO MÉDICO
    public List<Paciente> getPacientesDoMedico(Long medicoId) {
        Optional<Medico> medicoOpt = medicoRepository.findById(medicoId);
        if (medicoOpt.isEmpty()) {
            throw new RuntimeException("Médico não encontrado");
        }
        return medicoOpt.get().getPacientes();
    }

    // MÉTODO PARA REALOCAR PACIENTE
    @Transactional
    public void realocarPaciente(Long pacienteId, Long novoMedicoId) {
        Paciente paciente = pacienteService.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        
        Medico novoMedico = medicoRepository.findById(novoMedicoId)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        if (!novoMedico.getAtivo()) {
            throw new RuntimeException("O médico de destino não está ativo");
        }

        paciente.transferirParaMedico(novoMedico);
        pacienteService.save(paciente);
    }

    // MÉTODO PARA DELETAR MÉDICO (SÓ SE NÃO TIVER PACIENTES)
    @Transactional
    public void deleteMedico(Long id) {
        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        if (!medico.podeSerExcluido()) {
            throw new RuntimeException("Médico possui pacientes vinculados. Realoque ou exclua os pacientes primeiro.");
        }

        medicoRepository.deleteById(id);
    }

    // MÉTODO PARA OBTER MÉDICOS ATIVOS (EXCETO O QUE ESTÁ SENDO DELETADO)
    public List<Medico> getMedicosAtivosExceto(Long medicoIdExcluido) {
        return medicoRepository.findAll().stream()
                .filter(m -> m.getAtivo() && !m.getId().equals(medicoIdExcluido))
                .toList();
    }
}