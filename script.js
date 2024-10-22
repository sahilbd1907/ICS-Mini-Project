function initialPermutation(block) {
    const initialPermutationTable = [
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17, 9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7
    ];

    let permutedBlock = "";
    for (let i = 0; i < 64; i++) {
        permutedBlock += block[initialPermutationTable[i] - 1];
    }
    return permutedBlock;
}


function finalPermutation(block) {
    const finalPermutationTable = [
        40, 8, 48, 16, 56, 24, 64, 32,
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41, 9, 49, 17, 57, 25
    ];

    let permutedBlock = "";
    for (let i = 0; i < 64; i++) {
        permutedBlock += block[finalPermutationTable[i] - 1];
    }
    return permutedBlock;
}


function desRound(left, right, key) {
   
    const expandedRight = right;  
    const rightXORKey = xorBinaryStrings(expandedRight, key);

   
    return [right, xorBinaryStrings(left, rightXORKey)];
}


function xorBinaryStrings(bin1, bin2) {
    let result = "";
    for (let i = 0; i < bin1.length; i++) {
        result += (bin1[i] === bin2[i]) ? "0" : "1";
    }
    return result;
}


function desEncrypt(block, key) {
    const permutedBlock = initialPermutation(block);
    let left = permutedBlock.substring(0, 32);
    let right = permutedBlock.substring(32);

   
    [left, right] = desRound(left, right, key);

    const finalBlock = finalPermutation(left + right);
    return finalBlock;
}


function stringToBinary(str) {
    return str.split("").map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join("");
}


function binaryToString(binary) {
    return binary.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join("");
}


function encryptImage() {
    const fileInput = document.getElementById('image-input');
    const encryptionKey = document.getElementById('encryption-key').value.trim();

    if (!fileInput.files.length || !encryptionKey) {
        alert('Please upload an image and enter an encryption key.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const base64 = reader.result.split(',')[1];  
        const binaryData = stringToBinary(atob(base64));

        const encryptedBinary = desEncrypt(binaryData.substring(0, 64), stringToBinary(encryptionKey));

        const blob = new Blob([encryptedBinary], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'encrypted_image.txt';
        link.click();

        alert('Image encrypted and downloaded successfully.');
    };
    reader.readAsDataURL(fileInput.files[0]);
}


function decryptImage() {
    const fileInput = document.getElementById('encrypted-file-input');
    const decryptionKey = document.getElementById('decryption-key').value.trim();

    if (!fileInput.files.length || !decryptionKey) {
        alert('Please upload the encrypted file and enter a decryption key.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const encryptedBinary = reader.result;

        
        const decryptedBinary = desEncrypt(encryptedBinary, stringToBinary(decryptionKey));  // Use same function for simplicity

      
        const base64Image = btoa(binaryToString(decryptedBinary));
        const img = document.getElementById('decrypted-image');
        img.src = 'data:image/png;base64,' + base64Image;
        img.style.display = 'block';

        alert('Image decrypted successfully.');
    };
    reader.readAsText(fileInput.files[0]);
}
