package com.ClinicaOncologica.DTO;

import com.ClinicaOncologica.DTO.MedicoDTO;
import java.time.LocalDate;

public class PacienteDTO {
    private Long id;
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private String tipoCancer;
    private LocalDate dataInicioTratamento;
    private MedicoDTO medico;

    // CONSTRUTORES
    public PacienteDTO() {}

    public PacienteDTO(Long id, String nome, String cpf, LocalDate dataNascimento, 
                       String tipoCancer, LocalDate dataInicioTratamento, MedicoDTO medico) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.tipoCancer = tipoCancer;
        this.dataInicioTratamento = dataInicioTratamento;
        this.medico = medico;
    }

    // GETTERS AND SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getTipoCancer() {
        return tipoCancer;
    }

    public void setTipoCancer(String tipoCancer) {
        this.tipoCancer = tipoCancer;
    }

    public LocalDate getDataInicioTratamento() {
        return dataInicioTratamento;
    }

    public void setDataInicioTratamento(LocalDate dataInicioTratamento) {
        this.dataInicioTratamento = dataInicioTratamento;
    }

    public MedicoDTO getMedico() {
        return medico;
    }

    public void setMedico(MedicoDTO medico) {
        this.medico = medico;
    }
}