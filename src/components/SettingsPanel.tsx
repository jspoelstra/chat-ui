interface SettingsPanelProps {
  wsUri: string;
  setWsUri: (uri: string) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

function SettingsPanel({ wsUri, setWsUri, userId, setUserId }: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      <div className="setting">
        <label htmlFor="wsUri">WebSocket URI:</label>
        <input
          id="wsUri"
          type="text"
          value={wsUri}
          onChange={(e) => setWsUri(e.target.value)}
          placeholder="ws://localhost:501/ws"
        />
      </div>
      <div className="setting">
        <label htmlFor="userId">User ID:</label>
        <input
          id="userId"
          type="text"
          value={userId || ''}
          onChange={(e) => setUserId(e.target.value || null)}
          placeholder="user123"
        />
      </div>
    </div>
  );
}

export default SettingsPanel;