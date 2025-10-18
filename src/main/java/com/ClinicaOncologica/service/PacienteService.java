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

    public Optional<Paciente> findById(Long id) {
        return pacienteRepository.findById(id);
    }

    @Transactional
    public Paciente save(Paciente paciente) {
        return pacienteRepository.save(paciente);
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
}