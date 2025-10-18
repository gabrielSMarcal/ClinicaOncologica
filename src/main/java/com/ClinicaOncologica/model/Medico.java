package com.ClinicaOncologica.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medicos")
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String nome;
    @Column(nullable = false, unique = true, length = 20)
    private String crm;
    @Column(nullable = false)
    private Boolean ativo = true;

    @OneToMany(mappedBy = "medico")
    @JsonIgnore
    private List<Paciente> pacientes = new ArrayList<>();


    // CONSTRUTORES
    public Medico() {
        this.ativo = true;
    }

    public Medico(String nome, String crm) {
        this.nome = nome;
        this.crm = crm;
        this.ativo = true;
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

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public List<Paciente> getPacientes() {
        return pacientes;
    }

    public void setPacientes(List<Paciente> pacientes) {
        this.pacientes = pacientes;
    }

    // REGRAS DE NEGÓCIO
    public boolean podeSerExcluido() {
        return this.pacientes.isEmpty();
    }

    public int getQuantidadePacientes() {
        return this.pacientes.size();
    }

    public void adicionarPaciente(Paciente paciente) {
        this.pacientes.add(paciente);
        paciente.setMedico(this);
    }

    public void removerPaciente(Paciente paciente) {
        this.pacientes.remove(paciente);
        paciente.setMedico(null);
    }

}
