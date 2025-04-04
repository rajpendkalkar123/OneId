const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function compileCircuit() {
  try {
    // Create circuits directory if it doesn't exist
    const circuitsDir = path.join(__dirname, '../public/circuits');
    if (!fs.existsSync(circuitsDir)) {
      fs.mkdirSync(circuitsDir, { recursive: true });
    }

    // Download Powers of Tau file if it doesn't exist
    const ptauPath = path.join(circuitsDir, 'powersOfTau28_hez_final_10.ptau');
    if (!fs.existsSync(ptauPath)) {
      console.log('Downloading Powers of Tau file...');
      await downloadFile(
        'https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau',
        ptauPath
      );
    }

    // Copy circuit file to public directory
    const circuitSource = path.join(__dirname, '../circuits/age_verification.circom');
    const circuitDest = path.join(circuitsDir, 'age_verification.circom');
    fs.copyFileSync(circuitSource, circuitDest);

    // Compile the circuit
    console.log('Compiling circuit...');
    await execPromise(`cd ${circuitsDir} && circom age_verification.circom --r1cs --wasm --sym`);

    // Generate proving key
    console.log('Generating proving key...');
    await execPromise(`cd ${circuitsDir} && snarkjs groth16 setup age_verification.r1cs powersOfTau28_hez_final_10.ptau age_verification.zkey`);

    // Generate verification key
    console.log('Generating verification key...');
    await execPromise(`cd ${circuitsDir} && snarkjs zkey export verificationkey age_verification.zkey age_verification.vkey.json`);

    console.log('Circuit compilation completed successfully!');
  } catch (error) {
    console.error('Error compiling circuit:', error);
    process.exit(1);
  }
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

compileCircuit(); 