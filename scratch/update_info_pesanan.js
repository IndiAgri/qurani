const fs = require('fs');
const filePath = 'src/components/marketplace/orders/marketplace-orders-detail-page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Target 1: Sesi Selesai + Metode
const target1 = `                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Sesi Selesai</span>
                                    <span className="text-xs font-semibold text-emerald-600">{completedCount}/{order.sessions}</span>
                                </div>`;

const repl1 = `                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Sesi Selesai</span>
                                    <span className="text-xs font-semibold text-emerald-600">{completedCount} / {order.sessions}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Metode</span>
                                    <div className="flex flex-col items-end gap-0.5">
                                        <span className="text-xs font-semibold text-gray-800">
                                            {order.mode?.toLowerCase() === "offline" || order.method?.toLowerCase() === "offline" ? "Offline" : "Online"}
                                        </span>
                                        {(order.mode?.toLowerCase() === "offline" || order.method?.toLowerCase() === "offline") && order.offlineLocationType && (
                                            <span className="text-[10px] font-bold text-emerald-600">
                                                {order.offlineLocationType === "student" ? "Guru datang ke murid" : "Murid datang ke guru"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {(order.mode?.toLowerCase() === "offline" || order.method?.toLowerCase() === "offline") && order.address && (
                                    <div className="flex items-start justify-between">
                                        <span className="text-xs text-gray-500 font-medium">Lokasi</span>
                                        <div className="flex flex-col items-end gap-1 text-right max-w-[180px]">
                                            <span className="text-xs font-semibold text-gray-800">{order.address}</span>
                                        </div>
                                    </div>
                                )}`;

// Target 2: Nilai button
const target2 = `                                                    <Button 
                                                        variant="default"
                                                        className="flex-1 font-bold text-xs"
                                                        onClick={() => setIsReviewModalOpen(true)}
                                                    >
                                                        Nilai
                                                    </Button>`;

const repl2 = `                                                    <Button 
                                                        className="flex-1 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => setIsReviewModalOpen(true)}
                                                    >
                                                        Nilai
                                                    </Button>`;

// Target 3: Pesan Lagi when review exists
const target3 = `                                                    <Button 
                                                        variant="default"
                                                        className="flex-1 font-bold text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push(\`/\${locale}/teachers/\${order.trainerId}?orderAgain=true\`)
                                                        }}
                                                    >
                                                        Pesan Lagi
                                                    </Button>`;

const repl3 = `                                                    <Button 
                                                        className="flex-1 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push(\`/\${locale}/teachers/\${order.trainerId}?orderAgain=true\`)
                                                        }}
                                                    >
                                                        Pesan Lagi
                                                    </Button>`;

// Target 4: Condition order.status === "completed"
const target4 = `{order.status === "completed" ? (`;
const repl4 = `{(order.status === "completed" || (sessionDetails.length > 0 && sessionDetails.every(s => s.status === "completed"))) ? (`;

let normalizedContent = content.replace(/\r\n/g, '\n');
let normalizedTarget1 = target1.replace(/\r\n/g, '\n');
let normalizedTarget2 = target2.replace(/\r\n/g, '\n');
let normalizedTarget3 = target3.replace(/\r\n/g, '\n');
let normalizedTarget4 = target4.replace(/\r\n/g, '\n');

console.log('Includes Target 1:', normalizedContent.includes(normalizedTarget1));
console.log('Includes Target 2:', normalizedContent.includes(normalizedTarget2));
console.log('Includes Target 3:', normalizedContent.includes(normalizedTarget3));
console.log('Includes Target 4:', normalizedContent.includes(normalizedTarget4));

if (normalizedContent.includes(normalizedTarget1)) {
  normalizedContent = normalizedContent.replace(normalizedTarget1, repl1.replace(/\r\n/g, '\n'));
}
if (normalizedContent.includes(normalizedTarget2)) {
  normalizedContent = normalizedContent.replace(normalizedTarget2, repl2.replace(/\r\n/g, '\n'));
}
if (normalizedContent.includes(normalizedTarget3)) {
  normalizedContent = normalizedContent.replace(normalizedTarget3, repl3.replace(/\r\n/g, '\n'));
}
if (normalizedContent.includes(normalizedTarget4)) {
  normalizedContent = normalizedContent.replace(normalizedTarget4, repl4.replace(/\r\n/g, '\n'));
}

fs.writeFileSync(filePath, normalizedContent, 'utf8');
console.log('File successfully updated!');
