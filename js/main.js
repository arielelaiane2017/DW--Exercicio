const ipDataList = [];
const btnGetIp = document.querySelector('#btnGetIp');
const inputIpAddress = document.querySelector('#inputIpAddress');
const ipTable = document.querySelector('#ipTable');
const alertInfo = document.querySelector('#alert-info');

btnGetIp.addEventListener('click', handleAddIp);
inputIpAddress.addEventListener('keypress', handleKeyPress);

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        handleAddIp();
    }
}

function handleAddIp() {
    const ipAddress = inputIpAddress.value.trim();

    if (!ipAddress) {
        displayAlert('Opa! Parece que você não digitou um IP válido.', 'warning');
        return;
    }

    if (!isIpAlreadyAdded(ipAddress)) {
        fetchIpInfo(ipAddress);
    }
}

function isIpAlreadyAdded(ipAddress) {
    return ipDataList.some(data => data.ip === ipAddress);
}

function fetchIpInfo(ipAddress) {
    const url = `https://ipinfo.io/${ipAddress}/json?token=c77eb3002529bd`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const ipInfo = {
                ip: data.ip || '-',
                city: data.city || '-',
                country: data.country || '-',
                org: data.org ? data.org.split(' ').slice(1).join(' ') : '-',
                closeIcon: `<i class="fa fa-times" style="font-size: 22px;"></i>`,
            };
            ipDataList.push(ipInfo);
            updateTable();
        })
        .catch(() => {
            displayAlert('Erro ao buscar informações do IP.', 'danger');
        });
}

function updateTable() {
    if (ipDataList.length === 0) {
        ipTable.innerHTML = '';
        return;
    }

    if (ipTable.querySelector('thead') === null) {
        ipTable.innerHTML = `
            <thead>
                <tr><th>IP</th><th>Org</th><th>Country</th><th>City</th><th>Clear</th></tr>
            </thead>
            <tbody></tbody>
        `;
    }

    const ipTableBody = ipTable.querySelector('tbody');
    ipTableBody.innerHTML = ipDataList.map((data, index) => `
        <tr>
            <td>${data.ip}</td>
            <td>${data.org}</td>
            <td>${data.country}</td>
            <td>${data.city}</td>
            <td><a href="#" class="remove-row" data-index="${index}">${data.closeIcon}</a></td>
        </tr>
    `).join('');

    attachRemoveEvents();
}

function attachRemoveEvents() {
    document.querySelectorAll('.remove-row').forEach(button => {
        button.addEventListener('click', handleRemoveRow);
    });
}

function handleRemoveRow(e) {
    e.preventDefault();
    const index = e.currentTarget.getAttribute('data-index');
    ipDataList.splice(index, 1);
    updateTable();
}

function displayAlert(message, type) {
    alertInfo.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <strong>${message}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
}
