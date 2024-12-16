CREATE USER 'cliente'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
CREATE USER 'membro'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
CREATE USER 'dba'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';

DROP SCHEMA IF EXISTS aves_amazonia;

CREATE SCHEMA aves_amazonia;

USE aves_amazonia;

SET autocommit = 0;

GRANT ALL PRIVILEGES ON *.* TO 'dba'@'localhost' WITH GRANT OPTION;

CREATE TABLE user (
	usr_id INT,
    usr_nome VARCHAR(64),
    usr_cpf VARCHAR(12),
	usr_pwrd VARCHAR(64),
    PRIMARY KEY (usr_id)
);

CREATE TABLE post (
	pos_id INT,
    pos_titulo VARCHAR(255),
    pos_texto TEXT,
    pos_imagem VARCHAR(255),
    pos_usr_id INT,
    PRIMARY KEY (pos_id),
    FOREIGN KEY (pos_usr_id) REFERENCES user(usr_id)
);

DROP TABLE IF EXISTS bird_image;
DROP TABLE IF EXISTS bird_data;
CREATE TABLE bird_data (
	bdt_id INT AUTO_INCREMENT,
    bdt_nome VARCHAR(64) UNIQUE,
    bdt_nomecientifico VARCHAR(64),
    bdt_escextincao INT UNSIGNED,
    bdt_descricao VARCHAR(255),
    PRIMARY KEY (bdt_id)
);

CREATE TABLE bird_image (
	bim_id INT AUTO_INCREMENT,
    bim_bdt_id INT,
    bim_image VARCHAR(255),
    PRIMARY KEY (bim_id),
    FOREIGN KEY (bim_bdt_id) REFERENCES bird_data(bdt_id)
);

INSERT INTO bird_data (bdt_nome, bdt_nomecientifico, bdt_escextincao, bdt_descricao) 
VALUES ("Bem-te-vi", "Pitangus sulphuratus", 0, "O bem-te-vi é uma ave passeriforme da família dos Tiranídeos.
Conhecido também como bem-te-vi-de-coroa, bem-te-vi-verdadeiro e em alguns lugares do NE como cirino e no EUA como kiskidee, é provavelmente o pássaro mais popular de nosso país, podendo ser encontrado em cidades, matas, árvores à beira d'água, plantações e pastagens. Em regiões densamente florestadas habita margens e praias de rios.
É também muito popular nos outros países onde ocorre, recebendo nomes onomatopeicos em várias línguas como kiskadee em inglês, qu´est ce em francês (Guiana) e bichofêo em espanhol (Argentina).
# Características
Ave de médio porte, o bem-te-vi mede entre 20,5 e 25 centímetros de comprimento e pesa aproximadamente de 52-68 g. Tem o dorso pardo e a barriga de um amarelo vivo; uma listra (sobrancelha) branca no alto da cabeça, acima dos olhos; cauda preta. O bico é preto, achatado, longo, resistente e um pouco encurvado. A garganta (zona logo abaixo do bico) é de cor branca. Possui um topete amarelo somente visível quando a ave o eriça em determinadas situações.
O seu canto trissilábico característico lembra as sílabas bem-te-vi, que dão o nome à espécie. Portanto, seu nome popular possui origem onomatopeica.
Existem várias espécies de tiranídeos com o mesmo padrão de cores, dentre as quais 4 são particularmente similares ao bem-te-vi: o neinei (Megarynchus pitangua), o bentevizinho-do-brejo (Philohydor lictor), e os dois bentevizinhos do gênero Myiozetetes, o bentevizinho-de-penacho-vermelho (Myiozetetes similis) e o bentevizinho-de-asa-ferruginea (Myiozetetes cayanensis). O neinei é do mesmo tamanho do bem-te-vi, mas possui um bico maior e bem mais largo, o bentevizinho-do-brejo é mais esbelto, menor e apresenta o bico proporcionalmente mais afinado achatado. Já os bentevizinhos do gênero Myiozetetes são menores, possuem o bico cônico e proporcionalmente menor e as sobrancelhas brancas menos definidas. "),
("Periquito-de-asa-branca", "Brotogeris versicolurus", 0, "O periquito-da-campina é uma ave psittaciforme da família Psittacidae.
Conhecido também como periquito-de-asa-branca, periquito-das-ilhas (médio Solimões), periquito-de-asa-amarela (Amapá) e periquito-estrela (Pará). É o representante mais numeroso da família no delta amazônico.
Não está classificado em nenhuma das categorias de ameaça, seu comércio diminuiu nas últimas décadas.
# Características
Mede de 21,5 a 25 cm de comprimento. Único periquito com parte amarela e branca e ponta azul na asa, rabo verde longo e afiado (notórios em voo). De coloração geral verde, com ventre opaco, fronte e lados da cabeça cinzentos. "),
("Papagaio verdadeiro", "Amazona aestiva", 0, "O papagaio-verdadeiro é uma ave psittaciforme da família Psittacidae.
Conhecido também como ajuruetê, juru-etê, curau, papagaio-comum, papagaio-curau, papagaio-de-fronte-azul, papagaio-grego, papagaio-baiano, trombeteiro (Mato Grosso), papagaio-boiadeiro e louro, como são chamados todos os papagaios domesticados em nosso País.
Não está classificada em nenhuma categoria de ameaça.");

INSERT INTO bird_image (bim_bdt_id, bim_image)
VALUES (1, "/bemtevi/image1.jpg"),
(1, "/bemtevi/image2.jpg"),
(1, "/bemtevi/image3.jpg");

INSERT INTO bird_image (bim_bdt_id, bim_image)
VALUES (2, "/periquitodacampina/image1.jpg"),
(2, "/periquitodacampina/image2.jpg"),
(2, "/periquitodacampina/image3.jpg");

INSERT INTO bird_image (bim_bdt_id, bim_image)
VALUES (3, "/papagaioverdadeiro/image1.jpg"),
(3, "/papagaioverdadeiro/image2.jpg"),
(3, "/papagaioverdadeiro/image3.jpg");

DROP PROCEDURE IF EXISTS sp_add_bird;
DELIMITER ##
CREATE PROCEDURE sp_add_bird(p_nome VARCHAR(64), p_nomecientifico VARCHAR(64), p_escextincao INT UNSIGNED, p_imagens VARCHAR(255), p_descricao VARCHAR(255))
BEGIN
    DECLARE v_imagem_left VARCHAR(255) DEFAULT p_imagens;
    DECLARE v_imagem_right VARCHAR(255) DEFAULT p_imagens;
    DECLARE v_ave_id INT DEFAULT 0;

	IF p_escextincao > 6 THEN
		SELECT 'ERRO - ESCALA DE EXTINCAO MAIOR QUE 6';
    ELSE
		-- Insere a entrada sobre a ave na tabela bird_data
		INSERT INTO bird_data (bdt_nome, bdt_nomecientifico, bdt_escextincao, bdt_descricao) 
			VALUES (p_nome, p_nomecientifico, p_escextincao, p_descricao);
        SET v_ave_id = (SELECT bdt_id FROM bird_data WHERE bdt_nome = p_nome);
        
        -- Adiciona as referências das imagens na tabela bird_image
        image_loop: LOOP
			-- Sai do loop se não houver mais imagens para serem processadas
			IF LENGTH(v_imagem_right) = 0 THEN
				LEAVE image_loop;
			END IF;
            
            -- Extrai um caminho de imagens do parâmetro p_imagens
			SET v_imagem_left = LEFT(v_imagem_right, LOCATE(';', v_imagem_right) - 1);
            
            -- Mantém os caminhos de imagem não processados na variável v_imagem_right
            SET v_imagem_right = SUBSTRING(v_imagem_right, LOCATE(';', v_imagem_right) + 1);
            
            -- Insere a entrada sobre a imagem na tabela bird_image
            INSERT INTO bird_image (bim_bdt_id, bim_image)
				VALUES (v_ave_id, v_imagem_left);
        END LOOP image_loop;
	END IF;
END ##
DELIMITER ;
GRANT EXECUTE ON PROCEDURE aves_amazonia.sp_add_bird TO 'membro'@'localhost';

DROP PROCEDURE IF EXISTS sp_update_bird;
DELIMITER ##
CREATE PROCEDURE sp_update_bird(p_id INT, p_nome VARCHAR(64), p_nomecientifico VARCHAR(64), p_escextincao INT UNSIGNED, p_imagens TEXT)
BEGIN
    DECLARE v_imagem_left TEXT DEFAULT p_imagens;
    DECLARE v_imagem_right TEXT DEFAULT p_imagens;

	IF p_escextincao > 6 THEN
		SELECT 'ERRO - ESCALA DE EXTINCAO MAIOR QUE 6';
    ELSE
		-- Retira as antigas entradas das imagens
        DELETE FROM bird_image 
        WHERE bim_bdt_id = p_id;
    
		-- Atualiza a entrada sobre a ave na tabela bird_data
		UPDATE bird_data
        SET 
			bdt_nome = p_nome,
			bdt_nomecientifico = p_nomecientifico,
			bdt_escextincao = p_escextincao
        WHERE bdt_id = p_id;
        
        -- Adiciona as referências das imagens na tabela bird_image
        image_loop: LOOP
			-- Sai do loop se não houver mais imagens para serem processadas
			IF LENGTH(v_imagem_right) = 0 THEN
				LEAVE image_loop;
			END IF;
            
            -- Extrai um caminho de imagens do parâmetro p_imagens
			SET v_imagem_left = LEFT(v_imagem_right, LOCATE(';', v_imagem_right) - 1);
            
            -- Mantém os caminhos de imagem não processados na variável v_imagem_right
            SET v_imagem_right = SUBSTRING(v_imagem_right, LOCATE(';', v_imagem_right) + 1);
            
            -- Insere a entrada sobre a imagem na tabela bird_image
            INSERT INTO bird_image (bim_bdt_id, bim_image)
				VALUES (p_id, v_imagem_left);
        END LOOP image_loop;
	END IF;
END ##
DELIMITER ;
GRANT EXECUTE ON PROCEDURE aves_amazonia.sp_update_bird TO 'membro'@'localhost';

DROP PROCEDURE IF EXISTS sp_list_bird_images;
DELIMITER ##
CREATE PROCEDURE sp_list_bird_images(bird_name VARCHAR(64))
BEGIN
	SELECT bim_id, bim_bdt_id, bim_image
    FROM bird_data
    INNER JOIN bird_image ON bim_bdt_id = bdt_id AND bdt_nome = bird_name;
END ##
DELIMITER ;
GRANT EXECUTE ON PROCEDURE aves_amazonia.sp_list_bird_images TO 'cliente'@'localhost';
GRANT EXECUTE ON PROCEDURE aves_amazonia.sp_list_bird_images TO 'membro'@'localhost';

DROP PROCEDURE IF EXISTS sp_delete_bird;
DELIMITER ##
CREATE PROCEDURE sp_delete_bird(bird_id INT)
BEGIN
	DELETE FROM bird_image
    WHERE bim_bdt_id = bird_id;
    DELETE FROM bird_data
    WHERE bdt_id = bird_id;
END ##
DELIMITER ;
GRANT EXECUTE ON PROCEDURE aves_amazonia.sp_delete_bird TO 'membro'@'localhost';

GRANT SELECT, UPDATE, DELETE, INSERT ON aves_amazonia.post TO 'membro'@'localhost';
GRANT SELECT, UPDATE, DELETE, INSERT ON aves_amazonia.bird_data TO 'membro'@'localhost';
GRANT SELECT, UPDATE, DELETE, INSERT ON aves_amazonia.bird_image TO 'membro'@'localhost';