package com.ClinicaOncologica.controller;

import com.ClinicaOncologica.model.Medico;
import com.ClinicaOncologica.model.Paciente;
import com.ClinicaOncologica.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    @GetMapping
    public List<Medico> getAllMedicos() {
        return medicoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> getMedicoById(@PathVariable Long id) {
        return medicoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Medico createMedico(@RequestBody Medico medico) {
        return medicoService.save(medico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medico> updateMedico(@PathVariable Long id, @RequestBody Medico medicoDetails) {
        return medicoService.findById(id)
                .map(medico -> {
                    medico.setNome(medicoDetails.getNome());
                    medico.setCrm(medicoDetails.getCrm());
                    medico.setAtivo(medicoDetails.getAtivo());
                    return ResponseEntity.ok(medicoService.save(medico));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // VERIFICAR SE MÉDICO TEM PACIENTES ANTES DE DELETAR
    @GetMapping("/{id}/pode-deletar")
    public ResponseEntity<?> podeDeletar(@PathVariable Long id) {
        try {
            boolean temPacientes = medicoService.medicoPossuiPacientes(id);
            if (temPacientes) {
                List<Paciente> pacientes = medicoService.getPacientesDoMedico(id);
                List<Medico> medicosDisponiveis = medicoService.getMedicosAtivosExceto(id);
                
                Map<String, Object> response = new HashMap<>();
                response.put("podeDeletar", false);
                response.put("pacientes", pacientes);
                response.put("medicosDisponiveis", medicosDisponiveis);
                response.put("medicoId", id);
                
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.ok(Map.of("podeDeletar", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // REALOCAR PACIENTE PARA OUTRO MÉDICO
    @PostMapping("/realocar-paciente")
    public ResponseEntity<?> realocarPaciente(@RequestBody Map<String, Long> request) {
        try {
            Long pacienteId = request.get("pacienteId");
            Long novoMedicoId = request.get("novoMedicoId");
            
            medicoService.realocarPaciente(pacienteId, novoMedicoId);
            return ResponseEntity.ok(Map.of("mensagem", "Paciente realocado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // DELETAR MÉDICO (APÓS REALOCAÇÃO/EXCLUSÃO DE TODOS OS PACIENTES)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedico(@PathVariable Long id) {
        try {
            medicoService.deleteMedico(id);
            return ResponseEntity.ok(Map.of("mensagem", "Médico deletado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}