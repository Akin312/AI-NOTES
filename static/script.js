// Karakter sayacı
const noteInput = document.getElementById('noteInput');
const charCounter = document.getElementById('charCounter');

if (noteInput && charCounter) {
    noteInput.addEventListener('input', function() {
        charCounter.textContent = this.value.length;
    });
    
    // Sayfa yüklendiğinde mevcut değeri göster
    charCounter.textContent = noteInput.value.length;
}

// Temizle butonu
const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', function() {
        if (confirm('Notunuzu temizlemek istediğinizden emin misiniz?')) {
            noteInput.value = '';
            charCounter.textContent = '0';
            noteInput.focus();
        }
    });
}



// PDF İndirme Fonksiyonu - Basit ve Çalışan Versiyon
function downloadAsPDF() {
    try {
        // Önce bir yükleme mesajı göster
        showNotification('PDF oluşturuluyor...', 'info');
        
        // İçeriği topla
        const title = document.querySelector('.result-title-wrapper h2')?.textContent || 'AI Not Analiz Raporu';
        const confidence = document.querySelector('.confidence-badge .badge-value')?.textContent || '%95';
        const topicCount = document.querySelector('.count-badge .badge-value')?.textContent || '0';
        const topicCards = document.querySelectorAll('.topic-card');
        
        // PDF içeriğini oluştur
        let pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 20px auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3b82f6;
        }
        h1 {
            color: #1e40af;
            margin: 0;
            font-size: 24px;
        }
        .meta-info {
            color: #666;
            font-size: 14px;
            margin-top: 10px;
        }
        .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            margin: 0 10px;
        }
        .topic-card {
            margin: 20px 0;
            padding: 15px;
            border-left: 4px solid #3b82f6;
            background: #f8fafc;
            page-break-inside: avoid;
        }
        .topic-title {
            color: #1e293b;
            margin: 0 0 10px 0;
            font-size: 18px;
        }
        .topic-summary {
            color: #475569;
            margin: 0 0 15px 0;
            font-style: italic;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .detail-item {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: flex-start;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .bullet {
            color: #3b82f6;
            margin-right: 10px;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
        }
        @media print {
            body {
                margin: 0;
                padding: 10mm;
            }
            .topic-card {
                border: 1px solid #ddd;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <div class="meta-info">
            Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}
            <span class="badge">${confidence} Güven</span>
            <span class="badge" style="background:#3b82f6">${topicCount} Konu</span>
        </div>
    </div>
`;

        // Konuları ekle
        topicCards.forEach((card, index) => {
            const cardTitle = card.querySelector('.topic-title')?.textContent || `Konu ${index + 1}`;
            const cardSummary = card.querySelector('.topic-summary')?.textContent || '';
            const details = card.querySelectorAll('.result-item');
            
            pdfContent += `
    <div class="topic-card">
        <h3 class="topic-title">${index + 1}. ${cardTitle}</h3>`;
        
            if (cardSummary) {
                pdfContent += `<p class="topic-summary">${cardSummary}</p>`;
            }
            
            pdfContent += `<ul class="details-list">`;
            
            details.forEach((detail, detailIndex) => {
                const detailText = detail.querySelector('.item-text')?.textContent || '';
                if (detailText) {
                    pdfContent += `
            <li class="detail-item">
                <span class="bullet">•</span>
                <span>${detailText}</span>
            </li>`;
                }
            });
            
            pdfContent += `
        </ul>
    </div>`;
        });

        // Footer ekle
        pdfContent += `
    <div class="footer">
        <p>🤖 Bu rapor Akıllı Not Düzenleyici tarafından oluşturulmuştur.</p>
        <p>${window.location.href}</p>
    </div>
</body>
</html>`;

        // Yeni pencerede aç
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showNotification('Lütfen pop-up engelleyiciyi kapatın', 'error');
            return;
        }
        
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Sayfa yüklendikten sonra PDF olarak yazdır
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                showNotification('PDF yazdırma penceresi açıldı', 'success');
                
                // Yazdırma işlemi tamamlandıktan sonra pencereyi kapat
                printWindow.onafterprint = function() {
                    setTimeout(() => {
                        printWindow.close();
                    }, 1000);
                };
            }, 500);
        };
        
    } catch (error) {
        console.error('PDF oluşturma hatası:', error);
        showNotification('PDF oluşturulamadı: ' + error.message, 'error');
    }
}

// Alternatif PDF yazdırma fonksiyonu
function printPDF() {
    try {
        // Mevcut içeriği yazdırmaya hazır hale getir
        const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
        
        // Yazdırma için özel stil oluştur
        const printStyle = document.createElement('style');
        printStyle.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                .result-panel,
                .result-panel * {
                    visibility: visible;
                }
                .result-panel {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    background: white;
                    color: black;
                    border: none;
                    box-shadow: none;
                }
                .export-section,
                .quick-actions,
                .notification {
                    display: none !important;
                }
                .topic-card {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
                h1, h2, h3 {
                    color: black !important;
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        // Yazdır
        window.print();
        
        // Stili temizle
        setTimeout(() => {
            document.head.removeChild(printStyle);
            showNotification('Yazdırma başlatıldı', 'info');
        }, 100);
        
    } catch (error) {
        console.error('Yazdırma hatası:', error);
        showNotification('Yazdırma sırasında hata oluştu', 'error');
    }
}

// Diğer fonksiyonları güncelleyelim (mevcut olanları değiştirmeden)
// exportAsMarkdown fonksiyonunu güncelleyelim
function exportAsMarkdown() {
    try {
        const topicCards = document.querySelectorAll('.topic-card');
        let markdown = '# AI Not Analiz Raporu\n\n';
        
        markdown += `**Oluşturulma Tarihi:** ${new Date().toLocaleDateString('tr-TR')}\n`;
        markdown += `**Güven Skoru:** ${document.querySelector('.confidence-badge .badge-value')?.textContent || '%95'}\n`;
        markdown += `**Konu Sayısı:** ${topicCards.length}\n\n`;
        
        topicCards.forEach((card, index) => {
            const title = card.querySelector('.topic-title')?.textContent || `Konu ${index + 1}`;
            const summary = card.querySelector('.topic-summary')?.textContent || '';
            const details = card.querySelectorAll('.result-item .item-text');
            
            markdown += `## ${index + 1}. ${title}\n\n`;
            
            if (summary) {
                markdown += `*${summary}*\n\n`;
            }
            
            details.forEach(detail => {
                markdown += `- ${detail.textContent}\n`;
            });
            
            markdown += '\n';
        });
        
        markdown += '---\n';
        markdown += '*Akıllı Not Düzenleyici tarafından oluşturulmuştur*\n';
        
        // Markdown'ı indir
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-notlar-${new Date().getTime()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Markdown dosyası indirildi!', 'success');
        
    } catch (error) {
        console.error('Markdown export hatası:', error);
        showNotification('Markdown oluşturulamadı', 'error');
    }
}





// Loading state (tek ve temiz çözüm)
const noteForm = document.getElementById("noteForm");

if (noteForm) {
    noteForm.addEventListener("submit", function () {
        const submitBtn = this.querySelector(".primary-btn");
        const btnText = submitBtn.querySelector(".btn-text");

        submitBtn.disabled = true;
        submitBtn.classList.add("loading");
        btnText.textContent = "İşleniyor...";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const exampleText = document.querySelector(".example-text");
    const textarea = document.getElementById("noteInput");

    if (exampleText && textarea) {
        exampleText.addEventListener("click", () => {
            textarea.value = "tcp udp fark, dhcp ip dağıtır";
            textarea.focus();
        });
    }
});



// Bildirim göster
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon i');
    const title = notification.querySelector('h4');
    const text = notification.querySelector('p');
    
    text.textContent = message;
    
    switch(type) {
        case 'success':
            title.textContent = 'Başarılı!';
            icon.className = 'fa-solid fa-check-circle';
            notification.style.borderColor = '#10b981';
            break;
        case 'error':
            title.textContent = 'Hata!';
            icon.className = 'fa-solid fa-times-circle';
            notification.style.borderColor = '#ef4444';
            break;
        case 'info':
            title.textContent = 'Bilgi';
            icon.className = 'fa-solid fa-info-circle';
            notification.style.borderColor = '#3b82f6';
            break;
    }
    
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Kopyalama işlemi
function copyToClipboard() {
    const content = document.querySelector('.result-content')?.innerText || '';
    const copyBtn = document.getElementById('copyBtn');
    
    navigator.clipboard.writeText(content).then(() => {
        // Buton animasyonu
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
        
        showNotification('Tüm içerik panoya kopyalandı!', 'success');
    });
}

// İndirme işlemi
function downloadAsText() {
    const content = document.querySelector('.result-content')?.innerText || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-notlar-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Notlarınız indiriliyor...', 'info');
}

// Geliştirilmiş Paylaşma İşlemi
function shareResult() {
    try {
        // Tüm konu kartlarını topla
        const topicCards = document.querySelectorAll('.topic-card');
        let shareText = '🤖 AI Not Analiz Raporum:\n\n';
        
        topicCards.forEach((card, index) => {
            const title = card.querySelector('.topic-title')?.textContent || `Konu ${index + 1}`;
            const details = card.querySelectorAll('.result-item .item-text');
            
            shareText += `${index + 1}. ${title}\n`;
            
            details.forEach((detail, detailIndex) => {
                if (detailIndex < 3) { // Sadece ilk 3 detayı al
                    shareText += `   • ${detail.textContent}\n`;
                }
            });
            
            shareText += '\n';
        });
        
        // İstatistikleri ekle
        const confidence = document.querySelector('.confidence-badge .badge-value')?.textContent || '%95';
        const topicCount = document.querySelector('.count-badge .badge-value')?.textContent || '0';
        shareText += `\n📊 ${confidence} güven | ${topicCount} konu`;
        shareText += `\n\n📍 AI Not Düzenleyici ile oluşturuldu`;
        
        // Web Share API kontrolü
        if (navigator.share) {
            navigator.share({
                title: '🤖 AI Not Analiz Raporum',
                text: shareText,
                url: window.location.href
            })
            .then(() => {
                showNotification('Başarıyla paylaşıldı!', 'success');
            })
            .catch(error => {
                console.log('Paylaşım iptal edildi:', error);
                // Eğer kullanıcı iptal ederse, alternatif yöntem
                fallbackShare(shareText);
            });
        } else {
            // Web Share API desteklenmiyorsa
            fallbackShare(shareText);
        }
        
    } catch (error) {
        console.error('Paylaşım hatası:', error);
        showNotification('Paylaşım sırasında hata oluştu', 'error');
    }
}

// Alternatif paylaşım yöntemi (Web Share API desteklenmezse)
function fallbackShare(text) {
    try {
        // Önce panoya kopyala
        navigator.clipboard.writeText(text + '\n\n' + window.location.href)
            .then(() => {
                // Kullanıcıya seçenek sun
                if (confirm('Paylaşım linki panoya kopyalandı! WhatsApp, Telegram gibi uygulamalarda paylaşmak için Tamam\'a basın.')) {
                    // WhatsApp için özel link
                    const whatsappText = encodeURIComponent(text);
                    const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
                    
                    // WhatsApp'ı aç veya uyarı göster
                    window.open(whatsappUrl, '_blank');
                }
                showNotification('Paylaşım linki panoya kopyalandı!', 'success');
            })
            .catch(err => {
                console.error('Panoya kopyalama hatası:', err);
                showNotification('Panoya kopyalama başarısız', 'error');
            });
    } catch (error) {
        console.error('Fallback share hatası:', error);
        showNotification('Paylaşım desteklenmiyor', 'error');
    }
}

// Sosyal medya paylaşım butonları (isteğe bağlı - hızlı butonlara ekleyebilirsiniz)
function shareOnWhatsApp() {
    const topicCards = document.querySelectorAll('.topic-card');
    let shareText = '🤖 *AI Not Analiz Raporum* 🤖\n\n';
    
    topicCards.forEach((card, index) => {
        const title = card.querySelector('.topic-title')?.textContent || `Konu ${index + 1}`;
        shareText += `*${index + 1}. ${title}*\n`;
        
        // İlk 2 detayı al
        const details = card.querySelectorAll('.result-item .item-text');
        details.forEach((detail, detailIndex) => {
            if (detailIndex < 2) {
                shareText += `   • ${detail.textContent}\n`;
            }
        });
        
        shareText += '\n';
    });
    
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    showNotification('WhatsApp paylaşımı açılıyor...', 'info');
}

function shareOnTwitter() {
    const firstTopic = document.querySelector('.topic-title')?.textContent || 'AI Notlarım';
    const confidence = document.querySelector('.confidence-badge .badge-value')?.textContent || '%95';
    
    const tweetText = encodeURIComponent(`🤖 AI ile notlarımı analiz ettim: "${firstTopic}" (${confidence} güven) \n\n${window.location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    showNotification('Twitter paylaşımı açılıyor...', 'info');
}

function shareOnTelegram() {
    const topicCards = document.querySelectorAll('.topic-card');
    let shareText = '🤖 *AI Not Analiz Raporum* 🤖\n\n';
    
    topicCards.forEach((card, index) => {
        const title = card.querySelector('.topic-title')?.textContent || `Konu ${index + 1}`;
        shareText += `*${index + 1}. ${title}*\n`;
    });
    
    const encodedText = encodeURIComponent(shareText + '\n\n' + window.location.href);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`, '_blank');
    showNotification('Telegram paylaşımı açılıyor...', 'info');
}


 // Sayfa yüklendiğinde hafif animasyon
 document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.detail-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Tarih formatını güzelleştirme (isteğe bağlı)
    const dateElement = document.querySelector('.date');
    if(dateElement) {
        const originalDate = dateElement.textContent.trim();
        // Burada tarih formatını istediğiniz şekilde değiştirebilirsiniz
        // Örnek: dateElement.innerHTML = `<i class="far fa-calendar-alt"></i> ${new Date(originalDate).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
});



