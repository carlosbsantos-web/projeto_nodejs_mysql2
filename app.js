// Caminho para importar __dirname
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
console.log("directory-name 👉️", __dirname);

console.log(path.join(__dirname, "/dist", "index.html"));

import express from "express";

import mysql2 from "mysql2";

import { engine } from "express-handlebars";

import fileUpload from "express-fileupload";

import fs from "fs";

const port = 8080;

const app = express();

app.use(fileUpload());

app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

app.use("/css", express.static("./css"));

app.use("/imagens", express.static("./imagens"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const conexao = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "projeto",
});

conexao.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Conexão com banco de dados realizada com sucesso!");
  }
});

// app.get('/users', (req, res) =>  {

//     res.send('Uol');
//     res.end();
//   })

app.get("/users", (req, res) => {
  // res.render('form');

  let sql = "SELECT * FROM produtos";

  conexao.query(sql, (erro, retorno) => {
    res.render("form", { produtos: retorno });
  });
});

app.post("/users", (req, res) => {
  // console.log(req.body);
  // console.log(req.files.imagem.name);

  // req.files.imagem.mv(__dirname+'/imagens/'+req.files.imagem.name);
  // res.end();

  // Obter os dados que serão utilizados para o cadastro

  let nome = req.body.nome;
  let valor = req.body.valor;
  let imagem = req.files.imagem.name;

  let sql = `INSERT INTO  produtos (nome, valor, imagem) VALUES ('${nome}', ${valor}, '${imagem}')`;

  conexao.query(sql, (erro, retorno) => {
    if (erro) {
      console.log(erro);
    } else {
      req.files.imagem.mv(__dirname + "/imagens/" + req.files.imagem.name);

      console.log(retorno);
    }
  });

  res.redirect("/users");
});

app.get("/remover/:codigo&:imagem", (req, res) => {
  // console.log(req.params.codigo)
  // console.log(req.params.imagem)
  // res.end();

  let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;
  conexao.query(sql, (erro, retorno) => {
    if (erro) {
      console.log("Removido com sucesso");
    } else {
      fs.unlink(__dirname + "/imagens/" + req.params.imagem, (erro_imagem) => {
        console.log("Falha ao remover imagem");
      });
    }
  });

  res.redirect("/users");
});

app.get("/users/formEditar/:codigo", (req, res) => {
  // console.log(req.params.codigo)
  // res.end(); // codigo pra não entrar em loop infinito

  res.render("/users/formEditar");
});

app.listen(port, () => {
  console.log(`Sua conexão está rodando na porta ${port}`);
});
