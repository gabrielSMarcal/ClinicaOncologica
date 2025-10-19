package com.ClinicaOncologica.repository;

import com.ClinicaOncologica.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Long countByMedicoId(Long medicoId);
    List<Paciente> findByMedicoId(Long medicoId);
}