package com.ClinicaOncologica.controller;

import com.ClinicaOncologica.DTO.PacienteDTO;
import com.ClinicaOncologica.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @GetMapping
    public ResponseEntity<List<PacienteDTO>> listarTodos() {
        return ResponseEntity.ok(pacienteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PacienteDTO> cadastrar(@RequestBody PacienteDTO dto) {
        // Validar se o médico foi informado no corpo da requisição
        if (dto.getMedico() == null || dto.getMedico().getId() == null) {
            throw new IllegalArgumentException("Médico é obrigatório");
        }

        // Extrair o ID do médico do DTO
        Long medicoId = dto.getMedico().getId();

        // Chamar o serviço para cadastrar o paciente
        PacienteDTO resultado = pacienteService.cadastrar(dto, medicoId);

        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteDTO> atualizar(@PathVariable Long id, @RequestBody PacienteDTO dto) {
        return ResponseEntity.ok(pacienteService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pacienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}