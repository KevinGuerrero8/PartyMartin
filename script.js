const scriptURL = 'https://script.google.com/macros/s/AKfycbzHg9V0ZANX_MxNO8JunrMO8RE2nMKFsPcKCQ4Bnzu43KYArREg8T5nA_cC0PpshbMW/exec';
//2
// Función para agregar gasto
function agregarGasto() {
    const nombre = document.getElementById('nombre').value;
    const gasto = parseFloat(document.getElementById('gasto').value);

    if (nombre && gasto) {
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // También puedes probar con 'no-cors' si sigue fallando
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, gasto })
        })
        .then(response => {
            if (response.ok) {
                alert("Gasto agregado con éxito");
                cargarGastos(); // Actualizar la tabla
            } else {
                alert("Hubo un error al agregar el gasto");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la solicitud");
        });
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Función para cargar los gastos desde Google Sheets
function cargarGastos() {
    fetch(scriptURL)
    .then(response => {
        if (!response.ok) throw new Error('Error en la carga de gastos');
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#tablaGastos tbody");
        tbody.innerHTML = '';

        let totalGastado = 0;
        data.forEach(gasto => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${gasto.nombre}</td><td>$${parseFloat(gasto.gasto).toFixed(2)}</td>`;
            tbody.appendChild(row);
            totalGastado += parseFloat(gasto.gasto);
        });

        document.getElementById('totalGastado').innerText = `$${totalGastado.toFixed(2)}`;
    })
    .catch(error => {
        console.error('Error al cargar gastos:', error);
    });
}

// Función para calcular las diferencias
function calcularDiferencias() {
    const totalPorPersona = parseFloat(document.getElementById('totalGastado').innerText.slice(1)) / document.querySelectorAll("#tablaGastos tbody tr").length;
    document.getElementById('totalPorPersona').innerText = `$${totalPorPersona.toFixed(2)}`;
}

// Cargar los gastos cuando la página carga
window.onload = cargarGastos;

