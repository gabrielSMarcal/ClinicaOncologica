package com.ClinicaOncologica.service;

import com.ClinicaOncologica.dto.PacienteDTO;
import com.ClinicaOncologica.mapper.PacienteMapper;
import com.ClinicaOncologica.model.Medico;
import com.ClinicaOncologica.model.Paciente;
import com.ClinicaOncologica.repository.MedicoRepository;
import com.ClinicaOncologica.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    public List<PacienteDTO> listarTodos() {
        return pacienteRepository.findAll()
            .stream()
            .map(PacienteMapper::toDTO)
            .collect(Collectors.toList());
    }

    public PacienteDTO buscarPorId(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        return PacienteMapper.toDTO(paciente);
    }

    public PacienteDTO cadastrar(PacienteDTO dto, Long medicoId) {
        Medico medico = medicoRepository.findById(medicoId)
            .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        Paciente paciente = PacienteMapper.toEntity(dto);
        paciente.setMedico(medico);
        medico.adicionarPaciente(paciente);

        Paciente salvo = pacienteRepository.save(paciente);
        return PacienteMapper.toDTO(salvo);
    }

    public PacienteDTO atualizar(Long id, PacienteDTO dto) {
        Paciente paciente = pacienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        paciente.setNome(dto.getNome());
        paciente.setCpf(dto.getCpf());
        paciente.setDataNascimento(dto.getDataNascimento());
        paciente.setTipoCancer(dto.getTipoCancer());
        paciente.setDataInicioTratamento(dto.getDataInicioTratamento());

        Paciente atualizado = pacienteRepository.save(paciente);
        return PacienteMapper.toDTO(atualizado);
    }

    public void deletar(Long id) {
        pacienteRepository.deleteById(id);
    }
}