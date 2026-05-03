import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, Trash2, Plus, Terminal } from 'lucide-react';
import { toast } from 'sonner';

export const ApiKeysManager = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/cli/keys');
      const data = await res.json();
      if (data.success) {
        setKeys(data.keys);
      }
    } catch (error) {
      console.error(error);
      toast.error(lang === 'ar' ? 'فشل تحميل المفاتيح' : 'Failed to fetch keys');
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cli/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName })
      });
      const data = await res.json();
      if (data.success) {
        setNewKeyName('');
        setNewlyCreatedKey(data.key.key); // Show full key once
        fetchKeys();
        toast.success(lang === 'ar' ? 'تم إنشاء المفتاح بنجاح' : 'Key created successfully');
      }
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل إنشاء المفتاح' : 'Failed to create key');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await fetch(`/api/cli/keys/${id}`, { method: 'DELETE' });
      fetchKeys();
      toast.success(lang === 'ar' ? 'تم حذف المفتاح' : 'Key deleted');
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل حذف المفتاح' : 'Failed to delete key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success(lang === 'ar' ? 'تم النسخ' : 'Copied to clipboard');
  };

  const exampleUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/cli/execute` : 'https://YOUR_APP/api/cli/execute';

  const downloadBashScript = () => {
    const scriptContent = `#!/bin/bash
# Aether Core CLI Native Wrapper
# Save this file to /usr/local/bin/aether or inside your Termux bin folder (~/../usr/bin/aether)
# and make it executable: chmod +x aether

API_URL="${exampleUrl}"
API_KEY="\${AETHER_API_KEY:-}"

if [ -z "$API_KEY" ]; then
  echo "Error: AETHER_API_KEY environment variable is not set."
  echo "Please export your API key first:"
  echo "  export AETHER_API_KEY='aether_...'"
  exit 1
fi

if [ -z "$1" ]; then
  echo "⚡ Aether Core CLI"
  echo "Usage: aether <command> [args]"
  echo "Example: aether help"
  exit 1
fi

# Combine all arguments into the command string
shift 0
CMD="$*"

# JSON escape the command string
JSON_PAYLOAD=$(printf '{"command": "%s"}' "$CMD")

# Send the request
RESPONSE=$(curl -s -X POST "$API_URL" \\
  -H "X-API-Key: $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d "$JSON_PAYLOAD")

# Output extraction (Basic JSON parsing)
if command -v jq &> /dev/null; then
  echo "$RESPONSE" | jq -r '.output // .error'
else
  # Fallback if jq is not installed (Linux/Termux)
  python3 -c "import sys, json; print(json.load(sys.stdin).get('output', json.load(sys.stdin).get('error', 'Unknown Error')))" <<< "$RESPONSE"
fi
`;
    const element = document.createElement("a");
    const file = new Blob([scriptContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "aether";
    document.body.appendChild(element);
    element.click();
    toast.success(lang === 'ar' ? 'تم تنزيل أداة aether' : 'Aether CLI tool downloaded');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 font-mono text-sm max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-white">{lang === 'ar' ? 'مفاتيح الربط والـ CLI' : 'API Keys & CLI Access'}</h2>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-emerald-400 font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4" /> 
            {lang === 'ar' ? 'أداة Aether CLI الرسمية' : 'Official Aether CLI Tool'}
          </h3>
          <button 
            onClick={downloadBashScript}
            className="text-[10px] bg-emerald-600/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-600/40 transition-all font-bold flex items-center gap-2"
          >
            {lang === 'ar' ? 'تنزيل الأداة (aether.sh)' : 'Download CLI (aether.sh)'}
          </button>
        </div>
        <p className="text-zinc-400 mb-4 text-xs">
          {lang === 'ar' 
            ? 'قم برفع المشروع على أي استضافة خارجية (Render, VPS). ثم قم بتنزيل أداة Aether CLI ونقلها إلى مجلد bin في Termux أو Linux لتعمل بشكل أصلي.'
            : 'Deploy the project to any external host, then download the Aether CLI tool to your Termux or Linux bin folder for native execution.'}
        </p>
        <div className="bg-black p-3 rounded border border-zinc-800 overflow-x-auto text-[11px] leading-relaxed">
          <code className="text-zinc-300">
            <span className="text-zinc-500"># 1. Export your API Key</span><br/>
            <span className="text-pink-400">export</span> AETHER_API_KEY=<span className="text-emerald-400">"aether_YOUR_KEY"</span><br/><br/>
            
            <span className="text-zinc-500"># 2. Run commands natively!</span><br/>
            <span className="text-pink-400">aether</span> system --status<br/>
            <span className="text-pink-400">aether</span> chat <span className="text-amber-300">"Generate a python script to scan ports"</span><br/>
            <span className="text-pink-400">aether</span> code <span className="text-amber-300">"A cool bouncing ball animation in HTML"</span><br/>
            <span className="text-pink-400">aether</span> fix <span className="text-amber-300">"def main(): return True"</span><br/>
          </code>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-white font-bold mb-3">{lang === 'ar' ? 'إنشاء مفتاح جديد' : 'Generate New Key'}</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder={lang === 'ar' ? 'اسم المفتاح (مثال: Termux Phone)' : 'Key name (e.g. Termux Phone)'}
            className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
          <button 
            onClick={handleCreateKey}
            disabled={loading || !newKeyName.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {lang === 'ar' ? 'توليد' : 'Generate'}
          </button>
        </div>
        
        {newlyCreatedKey && (
          <div className="mt-4 p-4 bg-emerald-950/30 border border-emerald-900 rounded-lg">
            <p className="text-emerald-400 mb-2 font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              {lang === 'ar' ? 'تم إنشاء المفتاح بنجاح. انسخه الآن فلن يظهر مرة أخرى!' : 'Key created! Copy it now, it will not be shown again!'}
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-black p-2 rounded text-zinc-300 font-mono text-xs">{newlyCreatedKey}</code>
              <button 
                onClick={() => copyToClipboard(newlyCreatedKey)}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                title={lang === 'ar' ? 'نسخ' : 'Copy'}
              >
                {copiedKey === newlyCreatedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-white font-bold mb-3">{lang === 'ar' ? 'المفاتيح النشطة' : 'Active Keys'}</h3>
        {keys.length === 0 ? (
          <p className="text-zinc-500 italic">{lang === 'ar' ? 'لا توجد مفاتيح مسجلة' : 'No keys registered'}</p>
        ) : (
          <div className="space-y-3">
            {keys.map(key => (
              <div key={key.id} className="flex items-center justify-between bg-black border border-zinc-800 p-4 rounded-lg">
                <div>
                  <div className="font-bold text-white mb-1 flex items-center gap-2">
                    {key.name}
                    <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{key.id.substring(0, 8)}</span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    <span className="text-zinc-400 font-mono mr-3">{key.keyPrefix}</span>
                    {lang === 'ar' ? 'آخر استخدام: ' : 'Last used: '} 
                    {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : (lang === 'ar' ? 'لم يستخدم أبداً' : 'Never')}
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteKey(key.id)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title={lang === 'ar' ? 'إلغاء' : 'Revoke'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
