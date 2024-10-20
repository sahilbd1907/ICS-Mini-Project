// Encrypt the uploaded image
function encryptImage() {
    const fileInput = document.getElementById('image-input');
    const encryptionKey = document.getElementById('encryption-key').value.trim();

    if (!fileInput.files.length || !encryptionKey) {
        alert('Please upload an image and enter an encryption key.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        const base64 = reader.result.split(',')[1]; // Get base64 string
        const encrypted = CryptoJS.AES.encrypt(base64, encryptionKey).toString();

        const blob = new Blob([encrypted], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'encrypted_image.txt';
        link.click();

        alert('Image encrypted and downloaded successfully.');
    };
    reader.readAsDataURL(fileInput.files[0]);
}

// Decrypt the uploaded file and display the image
function decryptImage() {
    const fileInput = document.getElementById('encrypted-file-input');
    const decryptionKey = document.getElementById('decryption-key').value.trim();

    if (!fileInput.files.length || !decryptionKey) {
        alert('Please upload the encrypted file and enter a decryption key.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        try {
            const encryptedData = reader.result;
            const bytes = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
            const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedBase64) throw new Error('Decryption failed.');

            const img = document.getElementById('decrypted-image');
            img.src = 'data:image/png;base64,' + decryptedBase64;
            img.style.display = 'block';

            alert('Image decrypted successfully.');
        } catch (error) {
            console.error('Decryption error:', error);
            alert('Failed to decrypt the image: ' + error.message);
        }
    };
    reader.readAsText(fileInput.files[0]);
}
