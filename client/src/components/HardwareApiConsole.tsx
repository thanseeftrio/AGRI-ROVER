// client/src/components/HardwareApiConsole.tsx
import React, { useState } from 'react';
import { Terminal, Send, Copy, Sparkles, Cpu, ArrowRight } from 'lucide-react';

export const HardwareApiConsole: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('soil');
  const [testPlantId, setTestPlantId] = useState<string>('P082');
  const [testMoisture, setTestMoisture] = useState<number>(22);
  const [testTemp, setTestTemp] = useState<number>(27.5);
  const [testPh, setTestPh] = useState<number>(6.3);
  const [testEc, setTestEc] = useState<number>(1.12);
  const [roverBattery, setRoverBattery] = useState<number>(92);
  const [roverStatus, setRoverStatus] = useState<string>('Online');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const handleSendSoilTest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/soil/measurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantId: testPlantId,
          moisture: testMoisture,
          temperature: testTemp,
          ph: testPh,
          ec: testEc,
        }),
      });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRoverDataTest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rover/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battery: roverBattery,
          voltage: (roverBattery * 0.28).toFixed(1),
          status: roverStatus,
          speedMps: 0.5,
          currentLat: '12.971978',
          currentLng: '77.594636',
          probeState: 'Retracted',
        }),
      });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const curlSoilSample = `curl -X POST http://localhost:3001/api/soil/measurement \\
  -H "Content-Type: application/json" \\
  -d '{
    "plantId": "${testPlantId}",
    "moisture": ${testMoisture},
    "temperature": ${testTemp},
    "ph": ${testPh},
    "ec": ${testEc}
  }'`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEFEA] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F4F1]">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#0F172A]" />
            <h2 className="text-3xl font-serif font-normal text-[#0F172A] m-0">
              Hardware REST Integration Hub
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Connect external ESP32 microcontrollers, Raspberry Pi camera rigs, and autonomous telemetry streams.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#EBF4F0] border border-[#D1E2D7] text-[#065F46] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Active Server: http://localhost:3001</span>
        </div>
      </div>

      {/* Architecture Flow */}
      <div className="p-6 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
        <div className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider mb-4">
          END-TO-END HARDWARE PIPELINE ARCHITECTURE
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-white border border-[#EAEFEA] text-center flex-1 min-w-[120px] shadow-2xs">
            <div className="text-[#64748B] text-[10px]">Step 1</div>
            <div className="font-bold text-[#0F172A] mt-0.5">Physical Rover</div>
            <div className="text-[10px] text-[#64748B]">Motors & RTK GPS</div>
          </div>
          <span className="text-slate-300">→</span>

          <div className="p-3.5 rounded-2xl bg-white border border-[#EAEFEA] text-center flex-1 min-w-[120px] shadow-2xs">
            <div className="text-[#64748B] text-[10px]">Step 2</div>
            <div className="font-bold text-[#0F172A] mt-0.5">ESP32 MCU</div>
            <div className="text-[10px] text-[#64748B]">Depth Probe Drive</div>
          </div>
          <span className="text-slate-300">→</span>

          <div className="p-3.5 rounded-2xl bg-white border border-[#EAEFEA] text-center flex-1 min-w-[120px] shadow-2xs">
            <div className="text-[#64748B] text-[10px]">Step 3</div>
            <div className="font-bold text-emerald-800 mt-0.5">Raspberry Pi</div>
            <div className="text-[10px] text-[#64748B]">Vision & Neural AI</div>
          </div>
          <span className="text-slate-300">→</span>

          <div className="p-3.5 rounded-2xl bg-white border border-[#EAEFEA] text-center flex-1 min-w-[120px] shadow-2xs">
            <div className="text-[#64748B] text-[10px]">Step 4</div>
            <div className="font-bold text-[#0F172A] mt-0.5">REST API :3001</div>
            <div className="text-[10px] text-[#64748B]">JSON Telemetry</div>
          </div>
          <span className="text-slate-300">→</span>

          <div className="p-3.5 rounded-2xl bg-[#EBF4F0] border border-[#D1E2D7] text-center flex-1 min-w-[120px] shadow-2xs">
            <div className="text-[#065F46] text-[10px] font-bold">Step 5</div>
            <div className="font-bold text-[#065F46] mt-0.5">Web Dashboard</div>
            <div className="text-[10px] text-emerald-800">Farmer Decisions</div>
          </div>
        </div>
      </div>

      {/* Interactive API Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider m-0">
              Interactive Packet Dispatcher
            </h3>
            <div className="flex gap-1 bg-white p-1 rounded-full border border-[#D1E2D7]">
              <button
                onClick={() => setSelectedEndpoint('soil')}
                className={`px-3 py-1 rounded-full text-xs font-mono cursor-pointer transition-colors ${
                  selectedEndpoint === 'soil' ? 'bg-[#0F172A] text-white font-bold' : 'text-[#64748B]'
                }`}
              >
                Soil Probe
              </button>
              <button
                onClick={() => setSelectedEndpoint('rover')}
                className={`px-3 py-1 rounded-full text-xs font-mono cursor-pointer transition-colors ${
                  selectedEndpoint === 'rover' ? 'bg-[#0F172A] text-white font-bold' : 'text-[#64748B]'
                }`}
              >
                Rover Telemetry
              </button>
            </div>
          </div>

          {selectedEndpoint === 'soil' ? (
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[#64748B] block mb-1">Target Plant ID:</label>
                <input
                  type="text"
                  value={testPlantId}
                  onChange={(e) => setTestPlantId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1E2D7] text-[#0F172A] focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#64748B] block mb-1">Moisture (%):</label>
                  <input
                    type="number"
                    value={testMoisture}
                    onChange={(e) => setTestMoisture(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1E2D7] text-[#0F172A] focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[#64748B] block mb-1">Temperature (°C):</label>
                  <input
                    type="number"
                    value={testTemp}
                    onChange={(e) => setTestTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1E2D7] text-[#0F172A] focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#64748B] block mb-1">Soil pH:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={testPh}
                    onChange={(e) => setTestPh(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1E2D7] text-[#0F172A] focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[#64748B] block mb-1">EC (mS/cm):</label>
                  <input
                    type="number"
                    step="0.05"
                    value={testEc}
                    onChange={(e) => setTestEc(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1E2D7] text-[#0F172A] focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                onClick={handleSendSoilTest}
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch POST /api/soil/measurement</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#64748B] block mb-1">Battery (%):</label>
                  <input
                    type="number"
                    value={roverBattery}
                    onChange={(e) => setRoverBattery(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1E2D7] text-[#0F172A] focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[#64748B] block mb-1">Status:</label>
                  <select
                    value={roverStatus}
                    onChange={(e) => setRoverStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1E2D7] text-[#0F172A] focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Online">Online</option>
                    <option value="Scanning">Scanning</option>
                    <option value="Moving">Moving</option>
                    <option value="Measuring">Measuring</option>
                    <option value="Idle">Idle</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSendRoverDataTest}
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch POST /api/rover/data</span>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-[#EAEFEA]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] mb-1">
              <span>ESP32 / Raspberry Pi CURL Test Command:</span>
              <button
                onClick={() => copyToClipboard(curlSoilSample)}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedCurl ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-2xl bg-white text-[#0F172A] text-[11px] font-mono overflow-x-auto border border-[#EAEFEA]">
              {curlSoilSample}
            </pre>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider m-0">
                Live Server Response Log
              </h3>
              <span className="text-[10px] font-mono text-[#065F46] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Socket Active
              </span>
            </div>

            <pre className="p-4 rounded-2xl bg-white text-[#0F172A] text-xs font-mono overflow-auto max-h-72 border border-[#EAEFEA]">
              {apiResponse || '// Ready. Dispatch test telemetry above or send requests from ESP32...'}
            </pre>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#EAEFEA] text-[11px] font-mono text-[#64748B]">
            <strong className="text-[#0F172A]">Supported Endpoints:</strong>
            <ul className="mt-1 space-y-0.5 list-disc list-inside">
              <li>POST /api/rover/data (GPS, battery, state)</li>
              <li>POST /api/soil/measurement (depth probe)</li>
              <li>POST /api/plant/image (camera module)</li>
              <li>POST /api/plant/analysis (edge AI inference)</li>
              <li>GET /api/stream (Server-Sent Events)</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
