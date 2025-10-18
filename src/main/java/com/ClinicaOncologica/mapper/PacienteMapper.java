package com.ClinicaOncologica.mapper;

import com.ClinicaOncologica.dto.MedicoDTO;
import com.ClinicaOncologica.dto.PacienteDTO;
import com.ClinicaOncologica.model.Medico;
import com.ClinicaOncologica.model.Paciente;

public class PacienteMapper {

    public static PacienteDTO toDTO(Paciente paciente) {
        if (paciente == null) {
            return null;
        }

        MedicoDTO medicoDTO = null;
        if (paciente.getMedico() != null) {
            Medico medico = paciente.getMedico();
            medicoDTO = new MedicoDTO(
                medico.getId(),
                medico.getNome(),
                medico.getCrm(),
                medico.getAtivo()
            );
        }

        return new PacienteDTO(
            paciente.getId(),
            paciente.getNome(),
            paciente.getCpf(),
            paciente.getDataNascimento(),
            paciente.getTipoCancer(),
            paciente.getDataInicioTratamento(),
            medicoDTO,
            paciente.getIdade()
        );
    }

    public static Paciente toEntity(PacienteDTO dto) {
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
}