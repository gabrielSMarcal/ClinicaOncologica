package com.ClinicaOncologica.service;

import com.ClinicaOncologica.model.Paciente;
import com.ClinicaOncologica.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public List<Paciente> findAll() {
        return pacienteRepository.findAll();
    }

    @Transactional
    public Paciente save(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public Optional<Paciente> findById(Long id) {
        return pacienteRepository.findById(id);
    }

    @Transactional
    public void deletePaciente(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        
        // Remove o relacionamento antes de deletar
        if (paciente.getMedico() != null) {
            paciente.getMedico().removerPaciente(paciente);
        }
        
        pacienteRepository.deleteById(id);
    }

    public Paciente update(Long id, Paciente pacienteDetails) {
        Paciente paciente = pacienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Paciente not found"));
        paciente.setNome(pacienteDetails.getNome());
        paciente.setCpf(pacienteDetails.getCpf());
        paciente.setDataNascimento(pacienteDetails.getDataNascimento());
        paciente.setTipoCancer(pacienteDetails.getTipoCancer());
        paciente.setDataInicioTratamento(pacienteDetails.getDataInicioTratamento());
        paciente.setMedico(pacienteDetails.getMedico());
        return pacienteRepository.save(paciente);
    }
}