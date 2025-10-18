package com.ClinicaOncologica.config;

import com.ClinicaOncologica.model.Medico;
import com.ClinicaOncologica.model.Paciente;
import com.ClinicaOncologica.repository.MedicoRepository;
import com.ClinicaOncologica.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Classe opcional para carregar dados iniciais no banco H2
 * Útil para testes e demonstração
 *
 * Para usar: crie a pasta 'config' em src/main/java/com/ClinicaOncologica/
 * e adicione esta classe lá.
 *
 * Para desabilitar: comente a annotation @Component
 */
// @Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Override
    public void run(String... args) throws Exception {
        // Criando médicos de exemplo
        Medico medico1 = new Medico(
                "Dr. Carlos Alberto Silva",
                "CRM-SP 123456"
        );

        Medico medico2 = new Medico(
                "Dra. Maria Helena Santos",
                "CRM-SP 654321"
        );

        Medico medico3 = new Medico(
                "Dr. João Pedro Costa",
                "CRM-RJ 789012"
        );

        medicoRepository.save(medico1);
        medicoRepository.save(medico2);
        medicoRepository.save(medico3);

        // Criando pacientes de exemplo
        Paciente paciente1 = new Paciente(
                "Ana Paula Oliveira",
                "123.456.789-00",
                LocalDate.of(1975, 3, 15),
                "Câncer de Mama",
                LocalDate.of(2024, 1, 10),
                medico1
        );

        Paciente paciente2 = new Paciente(
                "Roberto Fernandes",
                "234.567.890-11",
                LocalDate.of(1968, 7, 22),
                "Câncer de Próstata",
                LocalDate.of(2024, 2, 5),
                medico1
        );

        Paciente paciente3 = new Paciente(
                "Juliana Martins",
                "345.678.901-22",
                LocalDate.of(1982, 11, 8),
                "Leucemia",
                LocalDate.of(2024, 3, 12),
                medico2
        );

        Paciente paciente4 = new Paciente(
                "Fernando Alves",
                "456.789.012-33",
                LocalDate.of(1955, 5, 30),
                "Câncer de Pulmão",
                LocalDate.of(2024, 1, 20),
                medico3
        );

        pacienteRepository.save(paciente1);
        pacienteRepository.save(paciente2);
        pacienteRepository.save(paciente3);
        pacienteRepository.save(paciente4);

        System.out.println("\n✓ Dados iniciais carregados com sucesso!");
        System.out.println("  • 3 médicos cadastrados");
        System.out.println("  • 4 pacientes cadastrados\n");
    }
}
