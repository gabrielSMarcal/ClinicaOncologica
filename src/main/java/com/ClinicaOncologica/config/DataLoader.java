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
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Override
    public void run(String... args) throws Exception {
        // Criando 6 médicos de exemplo
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

        Medico medico4 = new Medico(
                "Dra. Patricia Mendes",
                "CRM-MG 345678"
        );

        Medico medico5 = new Medico(
                "Dr. Ricardo Tavares",
                "CRM-SP 901234"
        );

        Medico medico6 = new Medico(
                "Dra. Fernanda Lima",
                "CRM-RJ 567890"
        );

        medicoRepository.save(medico1);
        medicoRepository.save(medico2);
        medicoRepository.save(medico3);
        medicoRepository.save(medico4);
        medicoRepository.save(medico5);
        medicoRepository.save(medico6);

        // Criando 14 pacientes de exemplo (distribuídos entre os médicos)
        // Médico 1 - 3 pacientes
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
                "Sandra Regina",
                "987.654.321-99",
                LocalDate.of(1980, 9, 18),
                "Câncer de Cólon",
                LocalDate.of(2024, 4, 15),
                medico1
        );

        // Médico 2 - 3 pacientes
        Paciente paciente4 = new Paciente(
                "Juliana Martins",
                "345.678.901-22",
                LocalDate.of(1982, 11, 8),
                "Leucemia",
                LocalDate.of(2024, 3, 12),
                medico2
        );

        Paciente paciente5 = new Paciente(
                "Pedro Henrique Costa",
                "876.543.210-88",
                LocalDate.of(1992, 2, 25),
                "Linfoma",
                LocalDate.of(2024, 5, 8),
                medico2
        );

        Paciente paciente6 = new Paciente(
                "Mariana Souza",
                "765.432.109-77",
                LocalDate.of(1985, 6, 12),
                "Câncer de Ovário",
                LocalDate.of(2024, 6, 20),
                medico2
        );

        // Médico 3 - 2 pacientes
        Paciente paciente7 = new Paciente(
                "Fernando Alves",
                "456.789.012-33",
                LocalDate.of(1955, 5, 30),
                "Câncer de Pulmão",
                LocalDate.of(2024, 1, 20),
                medico3
        );

        Paciente paciente8 = new Paciente(
                "Claudia Rodrigues",
                "654.321.098-66",
                LocalDate.of(1970, 8, 5),
                "Melanoma",
                LocalDate.of(2024, 7, 10),
                medico3
        );

        // Médico 4 - 2 pacientes
        Paciente paciente9 = new Paciente(
                "José Carlos Pereira",
                "543.210.987-55",
                LocalDate.of(1963, 12, 14),
                "Câncer de Estômago",
                LocalDate.of(2024, 3, 25),
                medico4
        );

        Paciente paciente10 = new Paciente(
                "Beatriz Almeida",
                "432.109.876-44",
                LocalDate.of(1978, 4, 20),
                "Câncer de Tireoide",
                LocalDate.of(2024, 8, 5),
                medico4
        );

        // Médico 5 - 2 pacientes
        Paciente paciente11 = new Paciente(
                "Lucas Barbosa",
                "321.098.765-33",
                LocalDate.of(1990, 1, 8),
                "Câncer de Testículo",
                LocalDate.of(2024, 2, 18),
                medico5
        );

        Paciente paciente12 = new Paciente(
                "Gabriela Moreira",
                "210.987.654-22",
                LocalDate.of(1987, 10, 30),
                "Câncer de Pâncreas",
                LocalDate.of(2024, 9, 12),
                medico5
        );

        // Médico 6 - 2 pacientes
        Paciente paciente13 = new Paciente(
                "Antonio Silva Santos",
                "109.876.543-11",
                LocalDate.of(1958, 3, 7),
                "Câncer de Bexiga",
                LocalDate.of(2024, 4, 22),
                medico6
        );

        Paciente paciente14 = new Paciente(
                "Carolina Dias",
                "098.765.432-00",
                LocalDate.of(1995, 7, 16),
                "Câncer de Colo do Útero",
                LocalDate.of(2024, 10, 1),
                medico6
        );

        pacienteRepository.save(paciente1);
        pacienteRepository.save(paciente2);
        pacienteRepository.save(paciente3);
        pacienteRepository.save(paciente4);
        pacienteRepository.save(paciente5);
        pacienteRepository.save(paciente6);
        pacienteRepository.save(paciente7);
        pacienteRepository.save(paciente8);
        pacienteRepository.save(paciente9);
        pacienteRepository.save(paciente10);
        pacienteRepository.save(paciente11);
        pacienteRepository.save(paciente12);
        pacienteRepository.save(paciente13);
        pacienteRepository.save(paciente14);

        System.out.println("\n✓ Dados iniciais carregados com sucesso!");
        System.out.println("  • 6 médicos cadastrados");
        System.out.println("  • 14 pacientes cadastrados");
        System.out.println("  • Distribuição: Médico 1 (3 pacientes), Médico 2 (3 pacientes), Médicos 3-6 (2 pacientes cada)\n");
    }
}
