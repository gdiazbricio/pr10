import net from "net";
import {spawn} from "child_process"
import fs from "fs";

/**
 * Enum containing the options to be used.
 */
enum Options {
  Lines = 1,
  Words = 2,
  Chars = 3
}

/**
 * Server side code.
 * Creates a new server and listen from clients connected.
 */
net.createServer((connection) => {
  console.log("Se ha conectado un cliente");
  connection.write("Conectado al Servidor");

  connection.on("close", () => {
    console.log("Cliente desconectado");
  });
  
  connection.on("data", (dataJSON) => {
    const fileName = JSON.parse(dataJSON.toString()).filename;
    const optionString = JSON.parse(dataJSON.toString()).option;
    let myOptionEnum: Options;
    let isError: boolean = false;
    if (optionString === "words") myOptionEnum = Options.Words;
    else if (optionString === "chars") myOptionEnum = Options.Chars;
    else if (optionString == "lines") myOptionEnum = Options.Lines;
    else isError = true;
    
    if (fs.existsSync(fileName) && !isError) {
      const cat = spawn("cat", ["-n", fileName]);
      const wc = spawn("wc");
      cat.stdout.pipe(wc.stdin);
      let wcOutput = "";
      wc.stdout.on("data", (piece) => {
        wcOutput += piece;
      });
      wc.on("close", () => {
        const wcOutputAsArray = wcOutput.split(/\s+/);
        connection.write(wcOutputAsArray[myOptionEnum]);
        connection.destroy();
      });
    }
    else {
      connection.write(isError ? "Opción no soportada" : "No se encontró el archivo");
      connection.destroy();
    }
  })
}).listen(60300, () => {
  console.log("Esperando a que se conecten clientes");
});