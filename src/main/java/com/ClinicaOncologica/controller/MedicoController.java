package com.ClinicaOncologica.controller;

import com.ClinicaOncologica.DTO.MedicoDTO;
import com.ClinicaOncologica.DTO.PacienteDTO;
import com.ClinicaOncologica.model.Medico;
import com.ClinicaOncologica.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    @GetMapping
    public List<Medico> listarTodos() {
        return medicoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> buscarPorId(@PathVariable Long id) {
        Optional<Medico> medico = medicoService.buscarPorId(id);
        return medico.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/pacientes/count")
    public ResponseEntity<Long> contarPacientesPorMedico(@PathVariable Long id) {
        Long count = medicoService.contarPacientesPorMedico(id);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}/pacientes")
    public ResponseEntity<List<PacienteDTO>> listarPacientesPorMedico(@PathVariable Long id) {
        List<PacienteDTO> pacientes = medicoService.listarPacientesPorMedico(id);
        return ResponseEntity.ok(pacientes);
    }

    @PostMapping
    public ResponseEntity<Medico> criar(@RequestBody MedicoDTO medicoDTO) {
        Medico medico = new Medico();
        medico.setNome(medicoDTO.getNome());
        medico.setCrm(medicoDTO.getCrm());
        medico.setAtivo(true);
        
        Medico novoMedico = medicoService.salvar(medico);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoMedico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medico> atualizar(@PathVariable Long id, @RequestBody MedicoDTO medicoDTO) {
        Optional<Medico> medicoExistente = medicoService.buscarPorId(id);
        
        if (medicoExistente.isPresent()) {
            Medico medico = medicoExistente.get();
            medico.setNome(medicoDTO.getNome());
            medico.setCrm(medicoDTO.getCrm());
            medico.setAtivo(medicoDTO.getAtivo());
            
            Medico medicoAtualizado = medicoService.salvar(medico);
            return ResponseEntity.ok(medicoAtualizado);
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarMedico(@PathVariable Long id) {
        Long qtdPacientes = medicoService.contarPacientesPorMedico(id);
        if (qtdPacientes > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Este médico possui " + qtdPacientes + " paciente(s) vinculado(s). Realoque ou exclua os pacientes antes de deletar o médico.");
        }
        medicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}