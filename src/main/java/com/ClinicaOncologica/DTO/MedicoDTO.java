package com.ClinicaOncologica.DTO;

public class MedicoDTO {
    private Long id;
    private String nome;
    private String crm;
    private Boolean ativo;

    // CONSTRUTORES
    public MedicoDTO() {}

    public MedicoDTO(Long id, String nome, String crm, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.crm = crm;
        this.ativo = ativo;
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
}