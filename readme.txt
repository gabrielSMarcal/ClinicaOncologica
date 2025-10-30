Instruções para execução

Abrir programa no IntelliJ, executar o programa:

    src/main/java/com/ClinicaOncologica/ClinicaOncologicaApplication.java

Ele vai executar o Spring e rodar o DataLoader, com dados bases de médico e paciente

Para abrir o site, abra mesmo programa no VSCode e abra o arquivo abaixo com Live Server:

    src/resources/static/index.html

Com isso, será acessado a página inicial.

A partir dele, é possível acessar a página de pacientes e médicos, onde poderia operar CRUD em ambos

Regra de negócio extra comprovando a relação OneToMany de Médico para Pacientes, ao excluir ou inativar um médico que tenha
pacientes vinculados a ele, será solicitado para que você realoque ou exlua os pacientes vinculados a ela.

Para inativar o médico, é necessário clicar em Editar no médico em questão, então será disponibilizado tal opção, seguindo
a mesma regra de negócio para exclusão.

Médico inativado não será excluído, ainda aparecerá na lista de médicos, porém não é possível alocar novos pacientes a ele,
sendo necessário editar o status dele.


