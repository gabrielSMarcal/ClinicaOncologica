package com.ClinicaOncologica.mapper;

import com.ClinicaOncologica.DTO.*;
import com.ClinicaOncologica.model.Paciente;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PacienteMapper {

    public PacienteDTO toDTO(Paciente paciente) {
        if (paciente == null) {
            return null;
        }

        PacienteDTO dto = new PacienteDTO();
        dto.setId(paciente.getId());
        dto.setNome(paciente.getNome());
        dto.setCpf(paciente.getCpf());
        dto.setDataNascimento(paciente.getDataNascimento());
        dto.setTipoCancer(paciente.getTipoCancer());
        dto.setDataInicioTratamento(paciente.getDataInicioTratamento());
        dto.setMedico(paciente.getMedico() != null ? new MedicoDTO(
                paciente.getMedico().getId(),
                paciente.getMedico().getNome(),
                paciente.getMedico().getCrm(),
                paciente.getMedico().getAtivo()
        ) : null);

        return dto;
    }

    public Paciente toEntity(PacienteDTO dto) {
        if (dto == null) {
            return null;
        }

        Paciente paciente = new Paciente();
        paciente.setId(dto.getId());
        paciente.setNome(dto.getNome());
        paciente.setCpf(dto.getCpf());
        paciente.setDataNascimento(dto.getDataNascimento());
        paciente.setTipoCancer(dto.getTipoCancer());
        paciente.setDataInicioTratamento(dto.getDataInicioTratamento());

        return paciente;
    }

    public List<PacienteDTO> toDTOList(List<Paciente> pacientes) {
        return pacientes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}