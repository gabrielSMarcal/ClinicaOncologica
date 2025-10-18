package com.ClinicaOncologica.controller;

import com.ClinicaOncologica.model.Paciente;
import com.ClinicaOncologica.service.MedicoService;
import com.ClinicaOncologica.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private MedicoService medicoService;

    @GetMapping
    public List<Paciente> getAllPacientes() {
        return pacienteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> getPacienteById(@PathVariable Long id) {
        return pacienteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPaciente(@RequestBody Map<String, Object> request) {
        try {
            Paciente paciente = new Paciente();
            paciente.setNome((String) request.get("nome"));
            paciente.setCpf((String) request.get("cpf"));
            paciente.setDataNascimento(java.time.LocalDate.parse((String) request.get("dataNascimento")));
            paciente.setTipoCancer((String) request.get("tipoCancer"));
            paciente.setDataInicioTratamento(java.time.LocalDate.parse((String) request.get("dataInicioTratamento")));
            
            Long medicoId = Long.valueOf(request.get("medicoId").toString());
            return medicoService.findById(medicoId)
                    .map(medico -> {
                        paciente.setMedico(medico);
                        return ResponseEntity.ok(pacienteService.save(paciente));
                    })
                    .orElse(ResponseEntity.badRequest().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePaciente(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return pacienteService.findById(id)
                .map(paciente -> {
                    paciente.setNome((String) request.get("nome"));
                    paciente.setCpf((String) request.get("cpf"));
                    paciente.setDataNascimento(java.time.LocalDate.parse((String) request.get("dataNascimento")));
                    paciente.setTipoCancer((String) request.get("tipoCancer"));
                    paciente.setDataInicioTratamento(java.time.LocalDate.parse((String) request.get("dataInicioTratamento")));
                    
                    Long medicoId = Long.valueOf(request.get("medicoId").toString());
                    return medicoService.findById(medicoId)
                            .map(medico -> {
                                paciente.setMedico(medico);
                                return ResponseEntity.ok(pacienteService.save(paciente));
                            })
                            .orElse(ResponseEntity.badRequest().build());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaciente(@PathVariable Long id) {
        try {
            pacienteService.deletePaciente(id);
            return ResponseEntity.ok(Map.of("mensagem", "Paciente deletado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}