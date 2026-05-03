import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, Link as LinkIcon, Cpu, Globe, Zap, Beaker, 
  TrendingUp, Settings, Wifi, Glasses, Loader2, Sparkles, 
  Download, Copy, Save, Database, ShieldCheck, Box, 
  Microscope, LineChart, Binary, Network
} from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { toast } from 'sonner';
import { saveToInbox, downloadAsFile } from '../../lib/inbox';

// 1. Web Game Engine
export const GameEngineLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generate = async () => {
    if (!desc) return;
    setIsLoading(true);
    try {
      const prompt = `Act as a Game Architect. Design a web-based game (Phaser/Three.js) based on: "${desc}". Return JSON with: 'title', 'mechanics' (array), 'assetsNeeded' (array), 'baseCode' (string).`;
      const res = await brandApi.generateChat(prompt, "coding");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setResult(parsed);
         saveToInbox({ type: 'game', content: desc, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-orange-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Gamepad2 className="w-5 h-5 text-orange-500" />
        <h3 className="font-bold text-orange-500">{lang === 'ar' ? 'محرك الألعاب السحابي' : 'Cloud Game Engine'}</h3>
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-orange-500 outline-none" 
        placeholder={lang === 'ar' ? 'صف فكرة اللعبة وميكانيكا اللعب...' : 'Describe game idea and mechanics...'}
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-orange-500 text-black font-bold rounded-lg text-xs flex items-center justify-center gap-2">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {lang === 'ar' ? 'توليد هيكل اللعبة' : 'Generate Game Architecture'}
      </button>
      {result && (
        <div className="mt-4 p-3 bg-zinc-950 rounded border border-zinc-800 space-y-3">
          <h4 className="text-orange-400 font-bold text-sm uppercase">{result.title}</h4>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="text-zinc-500">MECHANICS: {result.mechanics?.join(', ')}</div>
            <div className="text-zinc-500">ASSETS: {result.assetsNeeded?.join(', ')}</div>
          </div>
          <pre className="text-[9px] text-zinc-400 bg-black/50 p-2 rounded overflow-x-auto max-h-40">{result.baseCode}</pre>
        </div>
      )}
    </div>
  );
};

// 2. Blockchain Lab
export const BlockchainLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [reqs, setReqs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contract, setContract] = useState<any>(null);

  const generate = async () => {
    if (!reqs) return;
    setIsLoading(true);
    try {
      const prompt = `Generate a secure Solidity Smart Contract based on: "${reqs}". Return JSON with: 'name', 'features' (array), 'security' (array), 'code' (string). Use latest standards.`;
      const res = await brandApi.generateChat(prompt, "coding");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setContract(parsed);
         saveToInbox({ type: 'blockchain', content: reqs, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-blue-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <LinkIcon className="w-5 h-5 text-blue-500" />
        <h3 className="font-bold text-blue-500">{lang === 'ar' ? 'مختبر البلوكشين' : 'Blockchain Lab'}</h3>
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-blue-500 outline-none" 
        placeholder={lang === 'ar' ? 'حدد متطلبات العقد الذكي (ERC20, NFT, DAO)...' : 'Define Smart Contract requirements (ERC20, NFT, DAO)...'}
        value={reqs}
        onChange={e => setReqs(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-xs">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 mx-auto" />}
      </button>
      {contract && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center bg-blue-500/10 p-2 rounded border border-blue-500/20">
            <span className="text-xs text-blue-400 font-bold">{contract.name}.sol</span>
            <button onClick={() => downloadAsFile(contract.code, `${contract.name}.sol`)} className="p-1 hover:bg-white/10 rounded"><Download className="w-3 h-3 text-zinc-400" /></button>
          </div>
          <pre className="text-[9px] text-zinc-300 bg-black/50 p-2 rounded overflow-x-auto h-64">{contract.code}</pre>
        </div>
      )}
    </div>
  );
};

// 3. Hardware Designer
export const HardwareLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generate = async () => {
    if (!idea) return;
    setIsLoading(true);
    try {
      const prompt = `Design a hardware circuit/PCB schematic for: "${idea}". Return JSON with: 'components' (array), 'wiring' (array), 'arduinoCode' (string), 'powerRequirements' (string).`;
      const res = await brandApi.generateChat(prompt, "coding");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setResult(parsed);
         saveToInbox({ type: 'hardware', content: idea, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-emerald-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Cpu className="w-5 h-5 text-emerald-500" />
        <h3 className="font-bold text-emerald-500">{lang === 'ar' ? 'مصمم الأجهزة والعتاد' : 'Hardware & PCB Designer'}</h3>
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-emerald-500 outline-none" 
        placeholder={lang === 'ar' ? 'حدد المهام الإلكترونية المطلوبة...' : 'Specify electronic functions needed...'}
        value={idea}
        onChange={e => setIdea(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : lang === 'ar' ? 'توليد المخطط الإلكتروني' : 'Generate Schematic'}
      </button>
      {result && (
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div className="p-3 bg-black/50 rounded border border-zinc-800">
            <h4 className="text-[10px] uppercase text-zinc-500 mb-2">Components List</h4>
            <div className="flex flex-wrap gap-1">
              {result.components?.map((c:string, i:number) => <span key={i} className="text-[9px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300">{c}</span>)}
            </div>
          </div>
          <div className="p-3 bg-black/50 rounded border border-zinc-800">
             <h4 className="text-[10px] uppercase text-zinc-500 mb-2">Firmware Code</h4>
             <pre className="text-[9px] text-zinc-400 overflow-x-auto">{result.arduinoCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Satellite Analytics
export const SatelliteLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const analyze = async () => {
    if (!target) return;
    setIsLoading(true);
    try {
      const prompt = `Simulate a geospatial satellite analysis for: "${target}". Return JSON with: 'coordinates' (string), 'landAnalysis' (string), 'threatLevel' (0-100), 'objectsDetected' (array).`;
      const res = await brandApi.generateChat(prompt, "general");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setData(parsed);
         saveToInbox({ type: 'satellite', content: target, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-fuchsia-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-5 h-5 text-fuchsia-500" />
        <h3 className="font-bold text-fuchsia-500">{lang === 'ar' ? 'تحليل الأقمار الصناعية' : 'Satellite Intelligence'}</h3>
      </div>
      <div className="relative">
        <input 
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-fuchsia-500 outline-none pr-10" 
          placeholder={lang === 'ar' ? 'أدخل الموقع أو الإحداثيات...' : 'Enter location or coordinates...'}
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <button onClick={analyze} disabled={isLoading} className="absolute right-2 top-2 p-1.5 hover:bg-white/10 rounded">
          <Binary className="w-4 h-4 text-fuchsia-400" />
        </button>
      </div>
      {data && (
        <div className="mt-4 space-y-3 font-mono">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-zinc-500 uppercase">Targeting</span>
            <span className="text-fuchsia-400">{data.coordinates}</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${data.threatLevel}%` }} className="h-full bg-fuchsia-500" />
          </div>
          <div className="text-[10px] text-zinc-400 bg-black/40 p-2 rounded">
            {data.landAnalysis}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Quantum Lab
export const QuantumLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [algo, setAlgo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulate = async () => {
    if (!algo) return;
    setIsLoading(true);
    try {
      const prompt = `Simulate a quantum computing state/algorithm: "${algo}". Return JSON with: 'qubits' (number), 'gatesUsed' (array), 'probabilityCloud' (array of objects), 'qiskitCode' (string).`;
      const res = await brandApi.generateChat(prompt, "coding");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setResult(parsed);
         saveToInbox({ type: 'quantum', content: algo, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-violet-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-violet-500" />
        <h3 className="font-bold text-violet-500">{lang === 'ar' ? 'محاكي الحوسبة الكمية' : 'Quantum Lab'}</h3>
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-violet-500 outline-none" 
        placeholder={lang === 'ar' ? 'حدد الخوارزمية (Shor, Grover, Teleportation)...' : 'Define algorithm (Shor, Grover, Teleportation)...'}
        value={algo}
        onChange={e => setAlgo(e.target.value)}
      />
      <button onClick={simulate} disabled={isLoading} className="w-full py-2 bg-violet-600 text-white font-bold rounded-lg text-xs">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'بدء المحاكاة الكمية' : 'Start Simulation')}
      </button>
      {result && (
        <div className="mt-4 p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2">
           <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">QUBITS</span>
              <span className="text-violet-400 font-bold">{result.qubits}</span>
           </div>
           <pre className="text-[9px] text-zinc-400 overflow-x-auto max-h-40">{result.qiskitCode}</pre>
        </div>
      )}
    </div>
  );
};

// 6. BioTech Lab
export const BioTechLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [molecule, setMolecule] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const analyze = async () => {
    if (!molecule) return;
    setIsLoading(true);
    try {
      const prompt = `Perform a bioinformatics analysis for: "${molecule}". Return JSON with: 'structure' (string), 'properties' (array), 'geneticSequences' (array), 'potentialMedicalApps' (string).`;
      const res = await brandApi.generateChat(prompt, "general");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setData(parsed);
         saveToInbox({ type: 'biotech', content: molecule, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-rose-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Beaker className="w-5 h-5 text-rose-500" />
        <h3 className="font-bold text-rose-500">{lang === 'ar' ? 'مختبر التكنولوجيا الحيوية' : 'BioTech Lab'}</h3>
      </div>
      <input 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-rose-500 outline-none" 
        placeholder={lang === 'ar' ? 'أدخل اسم المركب أو التسلسل...' : 'Enter molecule or sequence...'}
        value={molecule}
        onChange={e => setMolecule(e.target.value)}
      />
      <button onClick={analyze} disabled={isLoading} className="w-full py-2 bg-rose-600 text-white font-bold rounded-lg text-xs">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <Microscope className="w-4 h-4 mx-auto" />}
      </button>
      {data && (
        <div className="mt-4 space-y-2 text-[10px]">
           <div className="p-2 bg-rose-500/5 border border-rose-500/10 rounded text-rose-300">
              {data.structure}
           </div>
           <ul className="grid grid-cols-2 gap-1 text-zinc-500">
              {data.properties?.map((p:string, i:number) => <li key={i}>• {p}</li>)}
           </ul>
        </div>
      )}
    </div>
  );
};

// 7. FinTech Vault
export const FinTechVault = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [asset, setAsset] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);

  const analyze = async () => {
    if (!asset) return;
    setIsLoading(true);
    try {
      const prompt = `Provide quantitative financial forecasting and market analysis for: "${asset}". Return JSON with: 'pricePrediction' (string), 'riskLevel' (string), 'alphaStrategies' (array), 'correlationMatrix' (array of strings).`;
      const res = await brandApi.generateChat(prompt, "general");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setForecast(parsed);
         saveToInbox({ type: 'fintech', content: asset, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-emerald-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-emerald-500" />
        <h3 className="font-bold text-emerald-500">{lang === 'ar' ? 'خزينة التحليل المالي' : 'FinTech Analysis Vault'}</h3>
      </div>
      <input 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-emerald-500 outline-none" 
        placeholder={lang === 'ar' ? 'الأصل المالي أو السوق التحليلي...' : 'Financial asset or market indicator...'}
        value={asset}
        onChange={e => setAsset(e.target.value)}
      />
      <button onClick={analyze} disabled={isLoading} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <LineChart className="w-4 h-4 mx-auto" />}
      </button>
      {forecast && (
        <div className="mt-4 space-y-3">
           <div className="flex justify-between items-center bg-zinc-950 p-2 rounded">
              <span className="text-[10px] text-zinc-500 uppercase">Risk Level</span>
              <span className={`text-xs font-bold ${forecast.riskLevel.toLowerCase().includes('high') ? 'text-red-500' : 'text-emerald-500'}`}>{forecast.riskLevel}</span>
           </div>
           <div className="text-[10px] text-emerald-400">
              PREDICTION: {forecast.pricePrediction}
           </div>
        </div>
      )}
    </div>
  );
};

// 8. Robotics Lab
export const RoboticsLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [botType, setBotType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [design, setDesign] = useState<any>(null);

  const generate = async () => {
    if (!botType) return;
    setIsLoading(true);
    try {
      const prompt = `Design a robotic system and kinematics structure for: "${botType}". Return JSON with: 'title', 'actuators' (array), 'sensors' (array), 'physicsEngine' (string), 'rosCode' (string).`;
      const res = await brandApi.generateChat(prompt, "coding");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setDesign(parsed);
         saveToInbox({ type: 'robotics', content: botType, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-zinc-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-zinc-300" />
        <h3 className="font-bold text-zinc-300">{lang === 'ar' ? 'مختبر هندسة الروبوتات' : 'Robotics Controller Lab'}</h3>
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-white outline-none" 
        placeholder={lang === 'ar' ? 'صف نوع الروبوت ومهامه...' : 'Describe robot type and mission...'}
        value={botType}
        onChange={e => setBotType(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-zinc-200 text-black font-bold rounded-lg text-xs flex items-center justify-center gap-2">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
        {lang === 'ar' ? 'توليد تصميم الروبوت' : 'Generate Robot Design'}
      </button>
      {design && (
        <div className="mt-4 p-3 bg-zinc-950 rounded border border-zinc-800 space-y-3">
           <h4 className="text-zinc-200 font-bold text-xs">{design.title}</h4>
           <div className="text-[9px] text-zinc-400">ROS/PYTHON CODE Ready for deployment.</div>
           <pre className="text-[9px] text-zinc-400 bg-black/50 p-2 rounded overflow-y-auto max-h-32">{design.rosCode}</pre>
        </div>
      )}
    </div>
  );
};

// 9. IoT Hub
export const IoTHubLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [config, setConfig] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hub, setHub] = useState<any>(null);

  const generate = async () => {
    if (!config) return;
    setIsLoading(true);
    try {
      const prompt = `Design an IoT Dashboard and device hub configuration for: "${config}". Return JSON with: 'deviceName', 'protocols' (array), 'dataPoints' (array), 'alertRules' (array), 'grafanaConfig' (string).`;
      const res = await brandApi.generateChat(prompt, "coding");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setHub(parsed);
         saveToInbox({ type: 'iot', content: config, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-cyan-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Wifi className="w-5 h-5 text-cyan-500" />
        <h3 className="font-bold text-cyan-500">{lang === 'ar' ? 'مركز مراقبة IoT' : 'IoT Dashboard Hub'}</h3>
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-cyan-500 outline-none" 
        placeholder={lang === 'ar' ? 'حدد الأجهزة والمهام (MQTT, Websockets)...' : 'Define devices and protocols (MQTT, Websockets)...'}
        value={config}
        onChange={e => setConfig(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-cyan-600 text-white font-bold rounded-lg text-xs">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <ShieldCheck className="w-4 h-4 mx-auto" />}
      </button>
      {hub && (
        <div className="mt-4 p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2">
           <div className="text-xs text-cyan-400 uppercase font-bold">{hub.deviceName} Hub</div>
           <div className="flex flex-wrap gap-1">
              {hub.protocols?.map((p:string, i:number) => <span key={i} className="text-[9px] px-1 bg-zinc-900 border border-zinc-800 text-zinc-500">{p}</span>)}
           </div>
           <pre className="text-[9px] text-zinc-400 bg-black/50 p-2 rounded h-32 overflow-y-auto">{hub.grafanaConfig}</pre>
        </div>
      )}
    </div>
  );
};

// 10. AR/VR Asset Factory
export const ARVRFactoryLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [assetDesc, setAssetDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [asset, setAsset] = useState<any>(null);

  const generate = async () => {
    if (!assetDesc) return;
    setIsLoading(true);
    try {
      const prompt = `Design a 3D/AR/VR spatial asset based on: "${assetDesc}". Return JSON with: 'modelName', 'textures' (array), 'animations' (array), 'unityScript' (string), 'polyCountLevel' (string).`;
      const res = await brandApi.generateChat(prompt, "coding");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setAsset(parsed);
         saveToInbox({ type: 'arvr', content: assetDesc, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-fuchsia-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Glasses className="w-5 h-5 text-fuchsia-500" />
        <h3 className="font-bold text-fuchsia-500">{lang === 'ar' ? 'مصنع الأصول الافتراضية XR' : 'AR/VR Asset Factory'}</h3>
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:border-fuchsia-500 outline-none" 
        placeholder={lang === 'ar' ? 'صف الأثر الافتراضي المطلوب...' : 'Describe spatial asset...'}
        value={assetDesc}
        onChange={e => setAssetDesc(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-fuchsia-600 text-white font-bold rounded-lg text-xs">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <Box className="w-4 h-4 mx-auto" />}
      </button>
      {asset && (
        <div className="mt-4 p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2">
           <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Asset</span>
              <span className="text-fuchsia-400 font-bold">{asset.modelName}</span>
           </div>
           <pre className="text-[9px] text-zinc-400 bg-black/50 p-2 rounded h-40 overflow-y-auto">{asset.unityScript}</pre>
        </div>
      )}
    </div>
  );
};
