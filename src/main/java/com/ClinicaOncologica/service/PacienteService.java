package com.ClinicaOncologica.service;

import com.ClinicaOncologica.DTO.PacienteDTO;
import com.ClinicaOncologica.mapper.PacienteMapper;
import com.ClinicaOncologica.model.Medico;
import com.ClinicaOncologica.model.Paciente;
import com.ClinicaOncologica.repository.MedicoRepository;
import com.ClinicaOncologica.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteMapper pacienteMapper;

    public List<PacienteDTO> listarTodos() {
        List<Paciente> pacientes = pacienteRepository.findAll();
        return pacienteMapper.toDTOList(pacientes);
    }

    public PacienteDTO buscarPorId(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        return pacienteMapper.toDTO(paciente);
    }

    public PacienteDTO cadastrar(PacienteDTO dto, Long medicoId) {
        // Buscar o médico pelo ID
        Medico medico = medicoRepository.findById(medicoId)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        // Mapear DTO para entidade
        Paciente paciente = pacienteMapper.toEntity(dto);

        // Vincular o médico ao paciente
        paciente.setMedico(medico);

        // Salvar paciente
        Paciente pacienteSalvo = pacienteRepository.save(paciente);

        return pacienteMapper.toDTO(pacienteSalvo);
    }

    public PacienteDTO atualizar(Long id, PacienteDTO dto) {
        Paciente pacienteExistente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Paciente pacienteAtualizado = pacienteMapper.toEntity(dto);
        pacienteAtualizado.setId(id);
        pacienteAtualizado.setMedico(pacienteExistente.getMedico());

        Paciente pacienteSalvo = pacienteRepository.save(pacienteAtualizado);

        return pacienteMapper.toDTO(pacienteSalvo);
    }

    public void deletar(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        pacienteRepository.delete(paciente);
    }

    public PacienteDTO realocarMedico(Long pacienteId, Long novoMedicoId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        
        Medico novoMedico = medicoRepository.findById(novoMedicoId)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));
        
        paciente.setMedico(novoMedico);
        Paciente pacienteSalvo = pacienteRepository.save(paciente);
        
        return pacienteMapper.toDTO(pacienteSalvo);
    }
}