package com.ClinicaOncologica.service;

import com.ClinicaOncologica.DTO.PacienteDTO;
import com.ClinicaOncologica.model.Medico;
import com.ClinicaOncologica.model.Paciente;
import com.ClinicaOncologica.mapper.PacienteMapper;
import com.ClinicaOncologica.repository.MedicoRepository;
import com.ClinicaOncologica.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PacienteMapper pacienteMapper;

    public List<Medico> listarTodos() {
        return medicoRepository.findAll();
    }

    public Optional<Medico> buscarPorId(Long id) {
        return medicoRepository.findById(id);
    }

    public Medico salvar(Medico medico) {
        return medicoRepository.save(medico);
    }

    public void deletar(Long id) {
        medicoRepository.deleteById(id);
    }

    public Long contarPacientesPorMedico(Long medicoId) {
        return pacienteRepository.countByMedicoId(medicoId);
    }

    public List<PacienteDTO> listarPacientesPorMedico(Long medicoId) {
        List<Paciente> pacientes = pacienteRepository.findByMedicoId(medicoId);
        return pacientes.stream()
            .map(pacienteMapper::toDTO)
            .collect(Collectors.toList());
    }
}