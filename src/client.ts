import net from "net"

if (process.argv.length !== 4) {
  console.log("An error occurred");
}
else {
  const fileName = process.argv[2];
  const option = process.argv[3];
  const client = net.connect({port: 60300});
  
  client.on('connect', () => {
    client.write(JSON.stringify({filename: fileName, option: option}));
  });
  
  let output = "";
  client.on("data", (data) => {
    output += data.toString();
  });

  client.on("end", () => {
    console.log(output);
  })

}