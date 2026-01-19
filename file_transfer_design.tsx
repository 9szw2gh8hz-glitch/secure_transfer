import React, { useState } from 'react';
import { FileText, Network, Shield, Cpu, Server, Smartphone, Monitor, ArrowRight, Lock, CheckCircle, XCircle } from 'lucide-react';

const FileTransferDesign = () => {
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'protocol', label: 'Protocol', icon: Network },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'implementation', label: 'Implementation', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SecureTransfer Protocol
          </h1>
          <p className="text-slate-400">Local-First Encrypted File Transfer System</p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mb-6 bg-slate-800/50 p-2 rounded-lg">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-slate-800/30 backdrop-blur rounded-xl p-6 border border-slate-700">
          {activeTab === 'architecture' && <ArchitectureView />}
          {activeTab === 'protocol' && <ProtocolView />}
          {activeTab === 'security' && <SecurityView />}
          {activeTab === 'implementation' && <ImplementationView />}
        </div>
      </div>
    </div>
  );
};

const ArchitectureView = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">System Architecture</h2>
      
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Hybrid Client-Server Model</h3>
        <p className="text-slate-300 mb-4">
          Each device acts as both client and server, enabling bidirectional transfers without a dedicated server.
        </p>
        
        {/* Architecture Diagram */}
        <div className="flex items-center justify-center space-x-8 my-8">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg">
              <Smartphone size={48} />
            </div>
            <span className="mt-2 text-sm text-slate-400">iOS Device</span>
            <div className="mt-2 text-xs bg-slate-700 px-3 py-1 rounded">Swift + Network.framework</div>
          </div>
          
          <div className="flex flex-col items-center">
            <ArrowRight size={32} className="text-cyan-400" />
            <div className="mt-2 text-xs text-slate-500">mDNS Discovery</div>
            <div className="text-xs text-slate-500">TCP Connection</div>
            <div className="text-xs text-slate-500">E2E Encryption</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg">
              <Monitor size={48} />
            </div>
            <span className="mt-2 text-sm text-slate-400">Desktop</span>
            <div className="mt-2 text-xs bg-slate-700 px-3 py-1 rounded">Python/Rust + BSD Sockets</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold text-green-400 mb-2">✓ Advantages</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• No single point of failure</li>
              <li>• Truly peer-to-peer operation</li>
              <li>• Works on isolated networks</li>
              <li>• Low latency transfers</li>
            </ul>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-400 mb-2">⚠ Trade-offs</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Both devices must be online</li>
              <li>• NAT traversal complexity</li>
              <li>• More complex state management</li>
              <li>• iOS background limitations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Component Responsibilities</h3>
        <div className="space-y-3">
          {[
            { name: 'Discovery Layer', desc: 'mDNS service broadcasting and listening for local peers' },
            { name: 'Connection Manager', desc: 'TCP socket lifecycle, timeout handling, reconnection logic' },
            { name: 'Protocol Handler', desc: 'Message serialization, deserialization, state machine' },
            { name: 'Security Module', desc: 'Key exchange, encryption/decryption, authentication' },
            { name: 'Transfer Engine', desc: 'Chunking, buffering, progress tracking, verification' },
            { name: 'Storage Interface', desc: 'Platform-specific file access, sandboxing compliance' }
          ].map((component, idx) => (
            <div key={idx} className="flex items-start space-x-3 bg-slate-800 p-3 rounded">
              <Server className="text-cyan-400 mt-1" size={20} />
              <div>
                <div className="font-semibold">{component.name}</div>
                <div className="text-sm text-slate-400">{component.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProtocolView = () => {
  const [selectedMessage, setSelectedMessage] = useState('HELLO');

  const messages = {
    'HELLO': {
      purpose: 'Initial connection, version negotiation',
      fields: ['protocol_version', 'device_id', 'device_name', 'capabilities'],
      response: 'HELLO_ACK or ERROR'
    },
    'AUTH': {
      purpose: 'Device authentication using public key cryptography',
      fields: ['device_id', 'challenge_response', 'public_key_hash'],
      response: 'AUTH_SUCCESS or AUTH_FAILED'
    },
    'FILE_META': {
      purpose: 'File transfer initialization',
      fields: ['file_id', 'filename', 'size', 'hash', 'chunk_size', 'total_chunks'],
      response: 'FILE_READY or FILE_REJECT'
    },
    'FILE_CHUNK': {
      purpose: 'Transfer individual file chunk',
      fields: ['file_id', 'chunk_index', 'chunk_data', 'chunk_hash'],
      response: 'CHUNK_ACK or CHUNK_RETRY'
    },
    'FILE_END': {
      purpose: 'Signal transfer completion',
      fields: ['file_id', 'final_hash'],
      response: 'FILE_COMPLETE or FILE_CORRUPT'
    },
    'VERIFY': {
      purpose: 'Integrity verification request',
      fields: ['file_id', 'verification_hash'],
      response: 'VERIFY_OK or VERIFY_FAIL'
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Protocol Specification</h2>
      
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Message Format</h3>
        <div className="bg-slate-950 p-4 rounded font-mono text-sm text-green-400 mb-4">
          [4 bytes: length] [1 byte: type] [1 byte: version] [N bytes: payload]
        </div>
        <p className="text-slate-300 text-sm">
          <strong>Serialization:</strong> Protocol Buffers or MessagePack for efficient binary encoding
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
          <h4 className="font-semibold mb-3 text-cyan-400">Message Types</h4>
          <div className="space-y-2">
            {Object.keys(messages).map(msg => (
              <button
                key={msg}
                onClick={() => setSelectedMessage(msg)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedMessage === msg
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-lg border border-slate-600">
          <h4 className="font-semibold mb-3 text-cyan-400">{selectedMessage} Details</h4>
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 text-sm">Purpose:</span>
              <p className="text-slate-200">{messages[selectedMessage].purpose}</p>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Fields:</span>
              <div className="mt-2 space-y-1">
                {messages[selectedMessage].fields.map((field, idx) => (
                  <div key={idx} className="bg-slate-800 px-3 py-1 rounded text-sm font-mono">
                    {field}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Expected Response:</span>
              <p className="text-green-400 font-mono text-sm mt-1">{messages[selectedMessage].response}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">State Machine</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded">
            <div className="w-32 font-semibold text-slate-300">DISCONNECTED</div>
            <ArrowRight className="text-slate-600" size={16} />
            <div className="text-slate-400">mDNS discovery → DISCOVERED</div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded">
            <div className="w-32 font-semibold text-slate-300">DISCOVERED</div>
            <ArrowRight className="text-slate-600" size={16} />
            <div className="text-slate-400">TCP connect + HELLO → CONNECTED</div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded">
            <div className="w-32 font-semibold text-slate-300">CONNECTED</div>
            <ArrowRight className="text-slate-600" size={16} />
            <div className="text-slate-400">AUTH success → AUTHENTICATED</div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded">
            <div className="w-32 font-semibold text-slate-300">AUTHENTICATED</div>
            <ArrowRight className="text-slate-600" size={16} />
            <div className="text-slate-400">FILE_META → TRANSFERRING</div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded">
            <div className="w-32 font-semibold text-slate-300">TRANSFERRING</div>
            <ArrowRight className="text-slate-600" size={16} />
            <div className="text-slate-400">FILE_END + VERIFY → COMPLETE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityView = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Security Model</h2>
      
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Key Exchange & Pairing</h3>
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="font-semibold text-green-400 mb-2">1. Initial Pairing (One-time)</div>
            <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
              <li>Device A generates ECDH key pair (Curve25519)</li>
              <li>Device B discovers A via mDNS</li>
              <li>User scans QR code containing: A's public key + device_id + timestamp</li>
              <li>B verifies timestamp (±2 min window) and stores A's public key</li>
              <li>B sends its public key to A over TCP</li>
              <li>Both derive shared secret using ECDH</li>
            </ol>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="font-semibold text-cyan-400 mb-2">2. Subsequent Connections</div>
            <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
              <li>Challenge-response authentication using stored keys</li>
              <li>Server sends 32-byte random challenge</li>
              <li>Client signs challenge with private key</li>
              <li>Server verifies signature with stored public key</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Encryption Pipeline</h3>
        <div className="bg-slate-950 p-4 rounded font-mono text-xs text-green-400 overflow-x-auto">
          plaintext → AES-256-GCM(key=HKDF(shared_secret), nonce=random) → ciphertext + tag
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800 p-3 rounded">
            <div className="text-sm font-semibold text-slate-300 mb-2">Per-Session Key Derivation</div>
            <div className="text-xs text-slate-400">
              session_key = HKDF(shared_secret, salt=timestamp, info="file_transfer")
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded">
            <div className="text-sm font-semibold text-slate-300 mb-2">Integrity Verification</div>
            <div className="text-xs text-slate-400">
              SHA-256 hash per chunk + final file hash comparison
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Threat Model</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="text-green-400" size={20} />
              <span className="font-semibold text-green-400">Protected Against</span>
            </div>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Eavesdropping (E2E encryption)</li>
              <li>• MITM attacks (key verification via QR)</li>
              <li>• Replay attacks (nonces + timestamps)</li>
              <li>• Unauthorized access (authentication)</li>
              <li>• Data corruption (cryptographic hashing)</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <XCircle className="text-red-400" size={20} />
              <span className="font-semibold text-red-400">Not Protected</span>
            </div>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Physical device compromise</li>
              <li>• Malicious paired device</li>
              <li>• Network DoS attacks</li>
              <li>• Side-channel attacks</li>
              <li>• Metadata analysis (file sizes, timing)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImplementationView = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Implementation Guide</h2>
      
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Technology Stack</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded">
            <div className="flex items-center space-x-2 mb-3">
              <Smartphone className="text-blue-400" />
              <span className="font-semibold">iOS Application</span>
            </div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li><strong>Language:</strong> Swift 5.9+</li>
              <li><strong>Networking:</strong> Network.framework, NWConnection</li>
              <li><strong>Discovery:</strong> NetService (mDNS)</li>
              <li><strong>Crypto:</strong> CryptoKit (AES-GCM, ECDH)</li>
              <li><strong>Storage:</strong> FileManager, UIDocumentPickerViewController</li>
              <li><strong>UI:</strong> SwiftUI</li>
            </ul>
          </div>
          
          <div className="bg-slate-800 p-4 rounded">
            <div className="flex items-center space-x-2 mb-3">
              <Monitor className="text-purple-400" />
              <span className="font-semibold">Desktop Application</span>
            </div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li><strong>Language:</strong> Python 3.10+ or Rust</li>
              <li><strong>Networking:</strong> socket (Python) / tokio (Rust)</li>
              <li><strong>Discovery:</strong> zeroconf (Python) / mdns (Rust)</li>
              <li><strong>Crypto:</strong> cryptography lib / rust-crypto</li>
              <li><strong>CLI:</strong> argparse / clap</li>
              <li><strong>Optional GUI:</strong> tkinter / egui</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Key Implementation Details</h3>
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded">
            <h4 className="font-semibold text-cyan-400 mb-2">Chunking Strategy</h4>
            <div className="text-sm text-slate-300 space-y-1">
              <p>• Chunk size: 64KB (balances memory usage vs. overhead)</p>
              <p>• Space complexity: O(1) - stream processing, one chunk in memory</p>
              <p>• Time complexity: O(n) where n = file_size / chunk_size</p>
              <p>• Progress tracking: (chunks_sent / total_chunks) * 100</p>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded">
            <h4 className="font-semibold text-cyan-400 mb-2">iOS Background Handling</h4>
            <div className="text-sm text-slate-300 space-y-1">
              <p>• Transfers pause when app backgrounds (iOS limitation)</p>
              <p>• State persisted to disk (chunk index, file hash)</p>
              <p>• Resume on next foreground or use URLSession for true background</p>
              <p>• Alternative: Keep connection alive with background tasks (limited time)</p>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded">
            <h4 className="font-semibold text-cyan-400 mb-2">Error Recovery</h4>
            <div className="text-sm text-slate-300 space-y-1">
              <p>• Connection timeout: 30s, then auto-reconnect (max 3 attempts)</p>
              <p>• Chunk retry: If hash mismatch, request retransmission (max 5 retries)</p>
              <p>• Partial transfer: Save state every 100 chunks for resume capability</p>
              <p>• Corruption detection: Atomic file writes via temp files + rename</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Design Trade-offs</h3>
        <div className="space-y-3">
          <div className="bg-slate-800 p-4 rounded">
            <div className="font-semibold text-yellow-400 mb-2">1. TCP vs UDP</div>
            <div className="text-sm text-slate-300">
              <strong>Choice: TCP</strong> - Provides reliable, ordered delivery without implementing custom reliability layer. 
              Trade-off: Lower throughput on lossy networks, but local LAN has minimal packet loss.
            </div>
          </div>
          
          <div className="bg-slate-800 p-4 rounded">
            <div className="font-semibold text-yellow-400 mb-2">2. Chunk Size (64KB)</div>
            <div className="text-sm text-slate-300">
              <strong>Smaller chunks:</strong> Better resume granularity, more overhead. 
              <strong>Larger chunks:</strong> Better throughput, more memory usage. 
              64KB balances both for mobile constraints.
            </div>
          </div>
          
          <div className="bg-slate-800 p-4 rounded">
            <div className="font-semibold text-yellow-400 mb-2">3. QR Code Pairing vs PIN</div>
            <div className="text-sm text-slate-300">
              <strong>QR Code:</strong> Faster, more secure (full key exchange), better UX. 
              <strong>PIN:</strong> Simpler to implement, but vulnerable to brute force and requires secure channel establishment.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Testing Strategy</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• Unit tests for protocol serialization/deserialization</li>
          <li>• Integration tests for connection lifecycle</li>
          <li>• Chaos testing: Random disconnections, corrupted chunks</li>
          <li>• Performance benchmarks: Transfer speed vs file size</li>
          <li>• Security audit: Attempted MITM, replay attacks</li>
        </ul>
      </div>
    </div>
  );
};

export default FileTransferDesign;