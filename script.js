// État global de la caisse
class CashRegister {
    constructor() {
        this.items = [];
        this.subtotal = 0;
        this.tax = 0;
        this.discount = 0;
        this.total = 0;
        this.taxRate = 0.20; // 20% TVA
        this.currentInput = '';
        this.inputMode = 'price'; // 'price' ou 'quantity'
        this.selectedItemIndex = -1;
        this.selectedProductBtn = null; // Pour la suppression de produits
        
        // Historique des ventes
        this.salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
        
        // Produits sauvegardés
        this.savedProducts = JSON.parse(localStorage.getItem('savedProducts')) || [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedProducts();
        this.updateDateTime();
        this.updateDisplay();
        this.updateHistorySummary();
        
        // Mise à jour de l'heure toutes les secondes
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    setupEventListeners() {
        // Gestion des produits
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.addNewProduct();
        });
        
        document.getElementById('removeProductBtn').addEventListener('click', () => {
            this.removeSelectedProduct();
        });
        
        // Produits prédéfinis - sera mis à jour dynamiquement
        this.setupProductListeners();
        
        // Saisie manuelle
        document.getElementById('addManualItem').addEventListener('click', () => {
            this.addManualItem();
        });
        
        // Clavier numérique
        document.querySelectorAll('.numpad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                const action = btn.dataset.action;
                
                if (value) {
                    this.handleNumpadInput(value);
                } else if (action) {
                    this.handleNumpadAction(action);
                }
            });
        });
        
        // Remises
        document.getElementById('applyPercentDiscount').addEventListener('click', () => {
            this.applyDiscount('percent');
        });
        
        document.getElementById('applyFixedDiscount').addEventListener('click', () => {
            this.applyDiscount('fixed');
        });
        
        document.getElementById('clearDiscount').addEventListener('click', () => {
            this.clearDiscount();
        });
        
        // Paiements
        document.getElementById('payCash').addEventListener('click', () => {
            this.showCashPayment();
        });
        
        document.getElementById('payCard').addEventListener('click', () => {
            this.processPayment('Carte');
        });
        
        document.getElementById('payCheck').addEventListener('click', () => {
            this.processPayment('Chèque');
        });
        
        // Montant reçu en espèces
        document.getElementById('cashReceived').addEventListener('input', () => {
            this.calculateChange();
        });
        
        // Actions principales
        document.getElementById('printReceipt').addEventListener('click', () => {
            this.printReceipt();
        });
        
        document.getElementById('newSale').addEventListener('click', () => {
            this.newSale();
        });
        
        document.getElementById('removeLastItem').addEventListener('click', () => {
            this.removeLastItem();
        });
        
        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAll();
        });
        
        // Historique
        document.getElementById('showHistory').addEventListener('click', () => {
            this.showHistory();
        });
        
        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });
        
        // Modales
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModals();
            });
        });
        
        document.getElementById('confirmPayment').addEventListener('click', () => {
            this.confirmPayment();
        });
        
        // Fermer modales en cliquant à l'extérieur
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
        
        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        document.getElementById('dateTime').textContent = now.toLocaleDateString('fr-FR', options);
    }
    
    addItem(name, price, quantity = 1) {
        const item = {
            id: Date.now(),
            name,
            price,
            quantity,
            total: price * quantity
        };
        
        this.items.push(item);
        this.calculateTotals();
        this.updateDisplay();
        this.updateReceipt();
        
        // Animation d'ajout
        this.animateItemAdd();
    }
    
    addManualItem() {
        const name = document.getElementById('itemName').value.trim();
        const price = parseFloat(document.getElementById('itemPrice').value);
        const quantity = parseInt(document.getElementById('itemQuantity').value) || 1;
        
        if (name && !isNaN(price) && price > 0) {
            this.addItem(name, price, quantity);
            
            // Réinitialiser les champs
            document.getElementById('itemName').value = '';
            document.getElementById('itemPrice').value = '';
            document.getElementById('itemQuantity').value = '1';
        } else {
            alert('Veuillez remplir tous les champs correctement.');
        }
    }
    
    calculateTotals() {
        this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
        this.tax = this.subtotal * this.taxRate;
        this.total = this.subtotal + this.tax - this.discount;
    }
    
    updateDisplay() {
        document.getElementById('subtotal').textContent = this.formatCurrency(this.subtotal);
        document.getElementById('tax').textContent = this.formatCurrency(this.tax);
        document.getElementById('discount').textContent = this.formatCurrency(this.discount);
        document.getElementById('total').textContent = this.formatCurrency(this.total);
    }
    
    updateReceipt() {
        const receiptItems = document.getElementById('receiptItems');
        const receiptFooter = document.getElementById('receiptFooter');
        
        // Effacer le contenu actuel
        receiptItems.innerHTML = '';
        
        // Ajouter les articles
        this.items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'receipt-item';
            itemDiv.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    ${item.quantity} x ${this.formatCurrency(item.price)}
                </div>
                <div>${this.formatCurrency(item.total)}</div>
            `;
            receiptItems.appendChild(itemDiv);
        });
        
        // Pied de ticket
        receiptFooter.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <span>Sous-total:</span>
                <span>${this.formatCurrency(this.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>TVA (20%):</span>
                <span>${this.formatCurrency(this.tax)}</span>
            </div>
            ${this.discount > 0 ? `
            <div style="display: flex; justify-content: space-between;">
                <span>Remise:</span>
                <span>-${this.formatCurrency(this.discount)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em; border-top: 2px solid #000; padding-top: 5px; margin-top: 5px;">
                <span>TOTAL:</span>
                <span>${this.formatCurrency(this.total)}</span>
            </div>
            <div style="text-align: center; margin-top: 15px; font-size: 0.9em;">
                ${new Date().toLocaleString('fr-FR')}<br>
                Merci de votre visite !
            </div>
        `;
    }
    
    handleNumpadInput(value) {
        this.currentInput += value;
        this.updateInputDisplay();
    }
    
    handleNumpadAction(action) {
        switch (action) {
            case 'clear':
                this.currentInput = '';
                this.updateInputDisplay();
                break;
            case 'backspace':
                this.currentInput = this.currentInput.slice(0, -1);
                this.updateInputDisplay();
                break;
            case 'quantity':
                this.inputMode = this.inputMode === 'quantity' ? 'price' : 'quantity';
                this.updateInputModeDisplay();
                break;
            case 'enter':
                this.processNumpadInput();
                break;
        }
    }
    
    updateInputDisplay() {
        // Afficher l'entrée actuelle dans le champ approprié
        if (this.inputMode === 'price') {
            document.getElementById('itemPrice').value = this.currentInput;
        } else {
            document.getElementById('itemQuantity').value = this.currentInput || '1';
        }
    }
    
    updateInputModeDisplay() {
        const qtyBtn = document.querySelector('[data-action=\"quantity\"]');
        qtyBtn.style.background = this.inputMode === 'quantity' ? 
            'linear-gradient(145deg, #f39c12, #e67e22)' : 
            'linear-gradient(145deg, #ecf0f1, #bdc3c7)';
        qtyBtn.style.color = this.inputMode === 'quantity' ? 'white' : '#2c3e50';
    }
    
    processNumpadInput() {
        if (this.currentInput) {
            const value = parseFloat(this.currentInput);
            if (!isNaN(value)) {
                if (this.inputMode === 'price') {
                    document.getElementById('itemPrice').value = value;
                } else {
                    document.getElementById('itemQuantity').value = Math.max(1, Math.floor(value));
                }
            }
            this.currentInput = '';
            this.updateInputDisplay();
        }
    }
    
    applyDiscount(type) {
        const amount = parseFloat(document.getElementById('discountAmount').value);
        if (isNaN(amount) || amount <= 0) {
            alert('Veuillez entrer un montant de remise valide.');
            return;
        }
        
        if (type === 'percent') {
            if (amount > 100) {
                alert('Le pourcentage de remise ne peut pas dépasser 100%.');
                return;
            }
            this.discount = this.subtotal * (amount / 100);
        } else {
            if (amount > this.subtotal) {
                alert('La remise ne peut pas être supérieure au sous-total.');
                return;
            }
            this.discount = amount;
        }
        
        this.calculateTotals();
        this.updateDisplay();
        this.updateReceipt();
        
        document.getElementById('discountAmount').value = '';
    }
    
    clearDiscount() {
        this.discount = 0;
        this.calculateTotals();
        this.updateDisplay();
        this.updateReceipt();
    }
    
    showCashPayment() {
        const cashPayment = document.getElementById('cashPayment');
        cashPayment.style.display = cashPayment.style.display === 'none' ? 'block' : 'none';
        
        if (cashPayment.style.display === 'block') {
            document.getElementById('cashReceived').focus();
        }
    }
    
    calculateChange() {
        const received = parseFloat(document.getElementById('cashReceived').value) || 0;
        const change = received - this.total;
        document.getElementById('changeAmount').textContent = this.formatCurrency(Math.max(0, change));
        
        if (change >= 0 && received > 0) {
            document.getElementById('changeAmount').style.color = '#27ae60';
        } else {
            document.getElementById('changeAmount').style.color = '#e74c3c';
        }
    }
    
    processPayment(method) {
        if (this.items.length === 0) {
            alert('Aucun article dans le panier.');
            return;
        }
        
        if (this.total <= 0) {
            alert('Le montant total doit être positif.');
            return;
        }
        
        let paymentDetails = '';
        
        if (method === 'Espèces') {
            const received = parseFloat(document.getElementById('cashReceived').value) || 0;
            if (received < this.total) {
                alert('Montant insuffisant.');
                return;
            }
            const change = received - this.total;
            paymentDetails = `
                <p><strong>Paiement en espèces</strong></p>
                <p>Total: ${this.formatCurrency(this.total)}</p>
                <p>Reçu: ${this.formatCurrency(received)}</p>
                <p>Rendu: ${this.formatCurrency(change)}</p>
            `;
        } else {
            paymentDetails = `
                <p><strong>Paiement par ${method}</strong></p>
                <p>Total: ${this.formatCurrency(this.total)}</p>
            `;
        }
        
        document.getElementById('paymentDetails').innerHTML = paymentDetails;
        document.getElementById('paymentModal').style.display = 'block';
        
        this.currentPaymentMethod = method;
    }
    
    confirmPayment() {
        // Enregistrer la vente dans l'historique
        const sale = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...this.items],
            subtotal: this.subtotal,
            tax: this.tax,
            discount: this.discount,
            total: this.total,
            paymentMethod: this.currentPaymentMethod
        };
        
        this.salesHistory.push(sale);
        localStorage.setItem('salesHistory', JSON.stringify(this.salesHistory));
        
        this.closeModals();
        this.newSale();
        this.updateHistorySummary();
        
        alert('Paiement confirmé ! Vente enregistrée.');
    }
    
    printReceipt() {
        if (this.items.length === 0) {
            alert('Aucun article à imprimer.');
            return;
        }
        
        const printWindow = window.open('', '_blank');
        const receiptContent = document.querySelector('.receipt').innerHTML;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ticket de caisse</title>
                <style>
                    body { font-family: 'Courier New', monospace; font-size: 12px; margin: 20px; }
                    .receipt { max-width: 300px; margin: 0 auto; }
                    hr { border: 1px solid #000; }
                </style>
            </head>
            <body>
                <div class="receipt">${receiptContent}</div>
                <script>window.print(); window.close();</script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }
    
    newSale() {
        this.items = [];
        this.subtotal = 0;
        this.tax = 0;
        this.discount = 0;
        this.total = 0;
        this.currentInput = '';
        this.selectedItemIndex = -1;
        
        this.updateDisplay();
        this.updateReceipt();
        
        // Réinitialiser les champs
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemQuantity').value = '1';
        document.getElementById('discountAmount').value = '';
        document.getElementById('cashReceived').value = '';
        document.getElementById('changeAmount').textContent = '0,00€';
        document.getElementById('cashPayment').style.display = 'none';
    }
    
    removeLastItem() {
        if (this.items.length > 0) {
            this.items.pop();
            this.calculateTotals();
            this.updateDisplay();
            this.updateReceipt();
        }
    }
    
    clearAll() {
        if (this.items.length > 0 && confirm('Êtes-vous sûr de vouloir tout effacer ?')) {
            this.newSale();
        }
    }
    
    showHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        if (this.salesHistory.length === 0) {
            historyList.innerHTML = '<p>Aucune vente enregistrée.</p>';
        } else {
            this.salesHistory.slice(-20).reverse().forEach(sale => {
                const saleDiv = document.createElement('div');
                saleDiv.style.cssText = 'border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: #f9f9f9;';
                
                const date = new Date(sale.date).toLocaleString('fr-FR');
                saleDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong>Vente #${sale.id}</strong>
                        <span>${date}</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        ${sale.items.map(item => `${item.name} (${item.quantity}x) - ${this.formatCurrency(item.total)}`).join('<br>')}
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Total: <strong>${this.formatCurrency(sale.total)}</strong></span>
                        <span>Paiement: ${sale.paymentMethod}</span>
                    </div>
                `;
                
                historyList.appendChild(saleDiv);
            });
        }
        
        document.getElementById('historyModal').style.display = 'block';
    }
    
    clearHistory() {
        if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
            this.salesHistory = [];
            localStorage.removeItem('salesHistory');
            this.updateHistorySummary();
            alert('Historique effacé.');
        }
    }
    
    updateHistorySummary() {
        const today = new Date().toDateString();
        const todaySales = this.salesHistory.filter(sale => 
            new Date(sale.date).toDateString() === today
        );
        
        const dailySalesCount = todaySales.length;
        const dailyTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        
        document.getElementById('dailySales').textContent = dailySalesCount;
        document.getElementById('dailyTotal').textContent = this.formatCurrency(dailyTotal);
    }
    
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    handleKeyboard(e) {
        // Raccourcis clavier
        if (e.ctrlKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    this.newSale();
                    break;
                case 'p':
                    e.preventDefault();
                    this.printReceipt();
                    break;
                case 'h':
                    e.preventDefault();
                    this.showHistory();
                    break;
            }
        }
        
        // Échap pour fermer les modales
        if (e.key === 'Escape') {
            this.closeModals();
        }
        
        // Entrée pour ajouter un article manuel
        if (e.key === 'Enter' && (
            e.target.id === 'itemName' || 
            e.target.id === 'itemPrice' || 
            e.target.id === 'itemQuantity'
        )) {
            e.preventDefault();
            this.addManualItem();
        }
    }
    
    animateItemAdd() {
        // Animation simple pour indiquer qu'un article a été ajouté
        const total = document.getElementById('total');
        total.style.transform = 'scale(1.1)';
        total.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            total.style.transform = 'scale(1)';
        }, 200);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }
    
    // Nouvelles méthodes pour la gestion des produits
    setupProductListeners() {
        document.querySelectorAll('.product-btn').forEach(btn => {
            // Supprimer les anciens listeners pour éviter les doublons
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Réattacher les listeners
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Si on maintient Ctrl/Cmd, on sélectionne pour suppression
                if (e.ctrlKey || e.metaKey) {
                    this.selectProductForDeletion(btn);
                } else {
                    // Sinon, on ajoute le produit au panier
                    const name = btn.dataset.name;
                    const price = parseFloat(btn.dataset.price);
                    this.addItem(name, price, 1);
                }
            });
            
            // Clic droit pour sélectionner pour suppression
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.selectProductForDeletion(btn);
            });
        });
    }
    
    selectProductForDeletion(btn) {
        // Désélectionner le précédent
        if (this.selectedProductBtn) {
            this.selectedProductBtn.classList.remove('selected');
        }
        
        // Sélectionner le nouveau
        this.selectedProductBtn = btn;
        btn.classList.add('selected');
    }
    
    addNewProduct() {
        const name = document.getElementById('newProductName').value.trim();
        const price = parseFloat(document.getElementById('newProductPrice').value);
        
        if (!name) {
            alert('Veuillez saisir un nom de produit.');
            return;
        }
        
        if (isNaN(price) || price <= 0) {
            alert('Veuillez saisir un prix valide.');
            return;
        }
        
        // Vérifier si le produit existe déjà
        const existingProduct = Array.from(document.querySelectorAll('.product-btn')).find(btn => 
            btn.dataset.name.toLowerCase() === name.toLowerCase()
        );
        
        if (existingProduct) {
            alert('Un produit avec ce nom existe déjà.');
            return;
        }
        
        // Créer le nouveau bouton de produit
        const productBtn = document.createElement('button');
        productBtn.className = 'product-btn';
        productBtn.dataset.name = name;
        productBtn.dataset.price = price.toString();
        productBtn.innerHTML = `${name}<br>${this.formatCurrency(price)}`;
        
        // Ajouter au DOM
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.appendChild(productBtn);
        
        // Sauvegarder le produit
        this.savedProducts.push({ name, price });
        localStorage.setItem('savedProducts', JSON.stringify(this.savedProducts));
        
        // Réattacher les listeners
        this.setupProductListeners();
        
        // Vider les champs
        document.getElementById('newProductName').value = '';
        document.getElementById('newProductPrice').value = '';
        
        // Animation d'ajout
        productBtn.style.opacity = '0';
        productBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            productBtn.style.transition = 'all 0.3s ease';
            productBtn.style.opacity = '1';
            productBtn.style.transform = 'scale(1)';
        }, 100);
        
        alert(`Produit "${name}" ajouté avec succès !`);
    }
    
    removeSelectedProduct() {
        if (!this.selectedProductBtn) {
            alert('Veuillez d\'abord sélectionner un produit à supprimer.\nClic droit ou Ctrl+Clic sur un produit pour le sélectionner.');
            return;
        }
        
        const productName = this.selectedProductBtn.dataset.name;
        
        if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?`)) {
            // Supprimer du DOM
            this.selectedProductBtn.remove();
            
            // Supprimer de la liste sauvegardée
            this.savedProducts = this.savedProducts.filter(product => 
                product.name !== productName
            );
            localStorage.setItem('savedProducts', JSON.stringify(this.savedProducts));
            
            // Réinitialiser la sélection
            this.selectedProductBtn = null;
            
            alert(`Produit "${productName}" supprimé avec succès !`);
        }
    }
    
    loadSavedProducts() {
        // Charger les produits sauvegardés et les ajouter au DOM
        this.savedProducts.forEach(product => {
            // Vérifier si le produit n'existe pas déjà dans le DOM
            const existingProduct = Array.from(document.querySelectorAll('.product-btn')).find(btn => 
                btn.dataset.name === product.name
            );
            
            if (!existingProduct) {
                const productBtn = document.createElement('button');
                productBtn.className = 'product-btn';
                productBtn.dataset.name = product.name;
                productBtn.dataset.price = product.price.toString();
                productBtn.innerHTML = `${product.name}<br>${this.formatCurrency(product.price)}`;
                
                const productsGrid = document.getElementById('productsGrid');
                productsGrid.appendChild(productBtn);
            }
        });
        
        // Réattacher les listeners après le chargement
        this.setupProductListeners();
    }
}

// Initialiser la caisse enregistreuse quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    window.cashRegister = new CashRegister();
});

// Fonctions utilitaires globales
window.addProduct = (name, price) => {
    if (window.cashRegister) {
        window.cashRegister.addItem(name, price, 1);
    }
};

// Prévenir la fermeture accidentelle de la page
window.addEventListener('beforeunload', (e) => {
    if (window.cashRegister && window.cashRegister.items.length > 0) {
        e.preventDefault();
        e.returnValue = 'Vous avez des articles dans le panier. Êtes-vous sûr de vouloir quitter ?';
    }
});

