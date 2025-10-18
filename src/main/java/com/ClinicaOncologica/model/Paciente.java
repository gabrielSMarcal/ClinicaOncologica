package com.ClinicaOncologica.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "pacientes")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String nome;
    @Column(nullable = false, unique = true, length = 14)
    private String cpf;
    @Column(nullable = false)
    private LocalDate dataNascimento;
    @Column(nullable = false, length = 100)
    private String tipoCancer;
    @Column(nullable = false)
    private LocalDate dataInicioTratamento;

    @ManyToOne
    @JoinColumn(name = "medico_id", nullable = false)
    @JsonManagedReference
    private Medico medico;

    // CONSTRUTORES
    public Paciente() {}

    public Paciente(String nome, String cpf, LocalDate dataNascimento, String tipoCancer, LocalDate dataInicioTratamento, Medico medico) {
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

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    // REGRAS DE NEGÓCIO
    public void transferirParaMedico(Medico novoMedico) {
        if (novoMedico == null) {
            throw new IllegalArgumentException("O novo médico não pode ser nulo.");
        }
        if (!novoMedico.getAtivo()) {
            throw new IllegalArgumentException("O novo médico deve estar ativo.");
        }
        if (this.medico != null) {
            this.medico.removerPaciente(this);
        }

        novoMedico.adicionarPaciente(this);
    }

    public int getIdade() {
        return LocalDate.now().getYear() - this.dataNascimento.getYear();
    }

}
