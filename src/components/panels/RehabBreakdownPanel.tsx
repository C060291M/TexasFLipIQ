'use client';
import type { PropertyInput, RehabResult } from '@/types';

const fmt = (n: number) =>
  '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

const COLORS = [
  '#1F3A5F','#2EC4B6','#E07B2A','#6B7C93',
  '#2980b9','#1a8a82','#935116','#C0392B','#888',
];

const ITEM_LABELS: Record<string, string> = {
  kitchen:    '🍳 Kitchen',
  bathrooms:  '🚿 Bathrooms',
  flooring:   '🪵 Flooring',
  roof:       '🏠 Roof',
  hvac:       '❄ HVAC',
  electrical: '⚡ Electrical',
  plumbing:   '🔧 Plumbing',
  paint:      '🎨 Paint',
  foundation: '🏗 Foundation',
  landscaping:'🌿 Landscaping',
  windows:    '🪟 Windows',
  doors:      '🚪 Doors',
  furnishing: '🛋 Furnishing',
  hotTub:     '♨️ Hot Tub',
  pool:       '🏊 Pool',
  contingency:'🛡 Contingency',
};

const COSMETIC_ITEMS    = ['paint', 'flooring', 'landscaping', 'doors', 'kitchen', 'bathrooms', 'contingency'];
const STRUCTURAL_ITEMS  = ['roof', 'hvac', 'electrical', 'plumbing', 'foundation', 'windows', 'contingency'];

function parseCustom(raw: string | undefined): number | null {
  if (raw === undefined || raw.trim() === '') return null;
  const parsed = parseFloat(raw.replace(/[,$]/g, ''));
  if (isNaN(parsed) || parsed < 0) return null;
  return Math.round(parsed);
}

interface Props {
  input:              PropertyInput;
  rehab:              RehabResult;
  enabledItems:       Record<string, boolean>;
  onToggle:           (key: string) => void;
  onSetEnabled:       (val: Record<string, boolean>) => void;
  // Custom budget props — lifted to parent so they flow into all calculations
  customBudgets:      Record<string, string>;
  onSetCustomBudgets: (val: Record<string, string>) => void;
}

export function RehabBreakdownPanel({
  input, rehab, enabledItems, onToggle, onSetEnabled,
  customBudgets, onSetCustomBudgets,
}: Props) {
  // Which items have the custom input open (local UI state only)
  const [customOpen, setCustomOpen] = (
    require('react') as typeof import('react')
  ).useState<Record<string, boolean>>({});

  const allEntries = Object.entries(rehab.lineItems).filter(([, v]) => (v ?? 0) > 0);
  const allKeys    = allEntries.map(([k]) => k);

  // Effective value: custom override if valid, else calculated
  const effectiveValue = (key: string, calcVal: number): number => {
    const custom = parseCustom(customBudgets[key]);
    return custom !== null ? custom : calcVal;
  };

  const activeItems   = allEntries.filter(([k]) => enabledItems[k] !== false);
  const zeroedItems   = allEntries.filter(([k]) => enabledItems[k] === false);
  const adjustedTotal = activeItems.reduce((a, [k, v]) => a + effectiveValue(k, v ?? 0), 0);
  const savedAmount   = zeroedItems.reduce((a, [k, v]) => a + effectiveValue(k, v ?? 0), 0);
  const fullTotal     = allEntries.reduce((a, [k, v]) => a + effectiveValue(k, v ?? 0), 0);
  const customCount   = allKeys.filter(k => parseCustom(customBudgets[k]) !== null).length;

  const ageMult =
    input.yearBuilt < 1970 ? '1.20×' :
    input.yearBuilt < 1985 ? '1.14×' :
    input.yearBuilt < 2000 ? '1.04×' : '1.00×';

  const handleAllItems = () =>
    onSetEnabled(Object.fromEntries(allKeys.map(k => [k, true])));

  const handleCosmeticOnly = () =>
    onSetEnabled(Object.fromEntries(allKeys.map(k => [k, COSMETIC_ITEMS.includes(k)])));

  const handleStructuralOnly = () =>
    onSetEnabled(Object.fromEntries(allKeys.map(k => [k, STRUCTURAL_ITEMS.includes(k)])));

  const toggleCustomOpen = (key: string) =>
    setCustomOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const handleCustomChange = (key: string, val: string) =>
    onSetCustomBudgets({ ...customBudgets, [key]: val });

  const clearCustom = (key: string) => {
    const next = { ...customBudgets };
    delete next[key];
    onSetCustomBudgets(next);
    setCustomOpen(prev => ({ ...prev, [key]: false }));
  };

  const clearAllCustom = () => {
    onSetCustomBudgets({});
    setCustomOpen({});
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[
          ['Full estimate',   fmt(fullTotal),       'All items',         '#1F3A5F'],
          ['Adjusted total',  fmt(adjustedTotal),   'Active items only', '#2EC4B6'],
          ['Scope reduction', fmt(savedAmount),     `${zeroedItems.length} item${zeroedItems.length!==1?'s':''} zeroed`, '#E07B2A'],
          ['Cost per sqft',   input.sqft > 0 ? `${fmt(Math.round(adjustedTotal/input.sqft))}/sqft` : '--', 'Adjusted', '#6B7C93'],
        ].map(([l, v, s, c]) => (
          <div key={l} style={{ background:'#FFFFFF', border:'1px solid #DDE3EC', borderRadius:10, padding:'14px 16px', boxShadow:'0 1px 3px rgba(31,58,95,0.06)' }}>
            <div style={{ fontSize:10, color:'#6B7C93', marginBottom:4, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div>
            <div style={{ fontSize:20, fontWeight:700, fontFamily:'monospace', color:c as string }}>{v}</div>
            <div style={{ fontSize:11, color:'#6B7C93', marginTop:2 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Custom budget banner */}
      {customCount > 0 && (
        <div style={{ background:'#fff8e1', border:'1px solid #E07B2A', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:13 }}>
            <strong style={{ color:'#935116' }}>✎ Custom budgets active — </strong>
            <span style={{ color:'#1F3A5F' }}>
              {customCount} item{customCount!==1?'s':''} using your custom amounts.{' '}
              <strong>Deal score, MAO, profit waterfall, PDF and CRM all reflect your overrides.</strong>
            </span>
          </div>
          <button
            onClick={clearAllCustom}
            style={{ fontSize:11, padding:'4px 12px', border:'1px solid #E07B2A', borderRadius:6, background:'#fff', color:'#935116', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap', marginLeft:16 }}>
            Clear all custom
          </button>
        </div>
      )}

      {/* Savings banner */}
      {savedAmount > 0 && (
        <div style={{ background:'#e8faf9', border:'1px solid #2EC4B6', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:13 }}>
            <strong style={{ color:'#1a8a82' }}>✓ Scope adjusted — </strong>
            <span style={{ color:'#1F3A5F' }}>
              Saving <strong>{fmt(savedAmount)}</strong> by zeroing {zeroedItems.length} item{zeroedItems.length!==1?'s':''}.{' '}
              <strong>Profit waterfall and deal score updated automatically.</strong>
            </span>
          </div>
          <button
            onClick={handleAllItems}
            style={{ fontSize:11, padding:'4px 12px', border:'1px solid #2EC4B6', borderRadius:6, background:'#fff', color:'#1a8a82', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap', marginLeft:16 }}>
            Reset all
          </button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* Toggle table */}
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:'#1F3A5F', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.08em' }}>
            Toggle items on / off
          </div>

          {/* Quick-select buttons */}
          <div style={{ display:'flex', gap:8, marginBottom:10 }}>
            <button onClick={handleAllItems}
              style={{ flex:1, padding:'7px', border:'1px solid #DDE3EC', borderRadius:6, background:'#fff', color:'#1F3A5F', cursor:'pointer', fontSize:12, fontWeight:600 }}>
              ✓ All items
            </button>
            <button onClick={handleCosmeticOnly}
              style={{ flex:1, padding:'7px', border:'1px solid #DDE3EC', borderRadius:6, background:'#fff', color:'#1F3A5F', cursor:'pointer', fontSize:12, fontWeight:600 }}>
              🎨 Cosmetic only
            </button>
            <button onClick={handleStructuralOnly}
              style={{ flex:1, padding:'7px', border:'1px solid #DDE3EC', borderRadius:6, background:'#fff', color:'#1F3A5F', cursor:'pointer', fontSize:12, fontWeight:600 }}>
              🏗 Structural only
            </button>
          </div>

          <div style={{ background:'#FFFFFF', border:'1px solid #DDE3EC', borderRadius:10, overflow:'hidden', boxShadow:'0 1px 3px rgba(31,58,95,0.06)' }}>
            {allEntries.map(([key, val], i) => {
              const isOn      = enabledItems[key] !== false;
              const isCustom  = parseCustom(customBudgets[key]) !== null;
              const isOpen    = customOpen[key];
              const dispVal   = effectiveValue(key, val ?? 0);

              return (
                <div key={key}>
                  {/* Main row */}
                  <div style={{
                    display:'flex', alignItems:'center', padding:'11px 16px',
                    borderBottom: isOpen ? 'none' : (i < allEntries.length-1 ? '1px solid #F0F2F5' : 'none'),
                    background: isOn ? '#fff' : '#F5F6F8',
                    opacity: isOn ? 1 : 0.55,
                    transition:'all 0.2s',
                  }}>

                    {/* Toggle switch */}
                    <div onClick={() => onToggle(key)}
                      style={{ width:36, height:20, borderRadius:10, background:isOn?'#2EC4B6':'#DDE3EC', position:'relative', cursor:'pointer', flexShrink:0, marginRight:12, transition:'background 0.2s' }}>
                      <div style={{ width:16, height:16, borderRadius:8, background:'#fff', position:'absolute', top:2, left:isOn?18:2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
                    </div>

                    {/* Color dot */}
                    <div style={{ width:10, height:10, borderRadius:2, background:isOn?COLORS[i%COLORS.length]:'#ccc', flexShrink:0, marginRight:10 }} />

                    {/* Label */}
                    <span style={{ flex:1, fontSize:13, color:isOn?'#1F3A5F':'#9ca3af', fontWeight:isOn?500:400 }}>
                      {ITEM_LABELS[key] || key}
                      {isCustom && (
                        <span style={{ marginLeft:6, fontSize:10, background:'#E07B2A', color:'#fff', borderRadius:4, padding:'1px 5px', fontWeight:700, verticalAlign:'middle' }}>
                          CUSTOM
                        </span>
                      )}
                    </span>

                    {/* Amount */}
                    <span style={{ fontFamily:'monospace', fontSize:13, color:isOn?(isCustom?'#E07B2A':'#1F3A5F'):'#9ca3af', marginRight:8 }}>
                      {isOn
                        ? fmt(dispVal)
                        : <span style={{ textDecoration:'line-through', color:'#ccc' }}>{fmt(dispVal)}</span>}
                    </span>

                    {/* Custom budget button */}
                    {isOn && (
                      <button
                        onClick={() => toggleCustomOpen(key)}
                        title="Set custom budget"
                        style={{
                          fontSize:11, padding:'2px 8px', marginRight:8,
                          border:`1px solid ${isCustom?'#E07B2A':'#DDE3EC'}`,
                          borderRadius:5,
                          background: isOpen ? (isCustom?'#fff8f0':'#F5F6F8') : (isCustom?'#fff8f0':'#fff'),
                          color: isCustom?'#E07B2A':'#6B7C93',
                          cursor:'pointer', fontWeight:600, flexShrink:0,
                        }}>
                        ✎
                      </button>
                    )}

                    {/* Percent */}
                    <span style={{ fontSize:11, color:'#6B7C93', width:36, textAlign:'right' }}>
                      {isOn ? ((dispVal / fullTotal) * 100).toFixed(0) + '%' : '—'}
                    </span>
                  </div>

                  {/* Custom budget input row */}
                  {isOpen && isOn && (
                    <div style={{
                      padding:'10px 16px 12px 74px',
                      borderBottom: i < allEntries.length-1 ? '1px solid #F0F2F5' : 'none',
                      background:'#FFFBF5',
                      display:'flex', alignItems:'center', gap:10,
                    }}>
                      <span style={{ fontSize:12, color:'#6B7C93', flexShrink:0 }}>Custom budget:</span>
                      <div style={{ position:'relative', flex:1, maxWidth:180 }}>
                        <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#6B7C93', fontSize:13 }}>$</span>
                        <input
                          type="number"
                          min={0}
                          placeholder={String(val ?? 0)}
                          value={customBudgets[key] ?? ''}
                          onChange={e => handleCustomChange(key, e.target.value)}
                          style={{
                            width:'100%', paddingLeft:22, paddingRight:8, paddingTop:6, paddingBottom:6,
                            border:'1px solid #E07B2A', borderRadius:6, fontSize:13,
                            fontFamily:'monospace', color:'#1F3A5F',
                            outline:'none', background:'#fff',
                            boxSizing:'border-box',
                          }}
                        />
                      </div>
                      <span style={{ fontSize:11, color:'#6B7C93' }}>
                        calc: {fmt(val ?? 0)}
                      </span>
                      {isCustom && (
                        <button
                          onClick={() => clearCustom(key)}
                          style={{ fontSize:11, padding:'3px 8px', border:'1px solid #DDE3EC', borderRadius:5, background:'#fff', color:'#C0392B', cursor:'pointer', fontWeight:600 }}>
                          Reset
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Total row */}
            <div style={{ display:'flex', alignItems:'center', padding:'12px 16px', background:'#1F3A5F' }}>
              <div style={{ width:36, marginRight:12 }} />
              <div style={{ width:10, marginRight:10 }} />
              <span style={{ flex:1, fontSize:13, fontWeight:700, color:'#fff' }}>
                Adjusted total
                {savedAmount > 0 && (
                  <span style={{ fontSize:11, fontWeight:400, color:'#A8BFDA', marginLeft:8 }}>
                    ({fmt(savedAmount)} removed)
                  </span>
                )}
                {customCount > 0 && (
                  <span style={{ fontSize:11, fontWeight:400, color:'#f5c97a', marginLeft:8 }}>
                    ({customCount} custom)
                  </span>
                )}
              </span>
              <span style={{ fontFamily:'monospace', fontSize:14, fontWeight:700, color:'#2EC4B6', marginRight:12 }}>
                {fmt(adjustedTotal)}
              </span>
              <span style={{ width:36 }} />
            </div>
          </div>
        </div>

        {/* Bar chart + engine details */}
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:'#1F3A5F', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.08em' }}>
            Budget allocation
          </div>
          <div style={{ background:'#FFFFFF', border:'1px solid #DDE3EC', borderRadius:10, padding:16, marginBottom:14, boxShadow:'0 1px 3px rgba(31,58,95,0.06)' }}>
            {allEntries.map(([key, val], i) => {
              const isOn    = enabledItems[key] !== false;
              const dispVal = effectiveValue(key, val ?? 0);
              const isCustom = parseCustom(customBudgets[key]) !== null;
              return (
                <div key={key} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, opacity:isOn?1:0.3 }}>
                  <span style={{ fontSize:11, color:'#6B7C93', width:110, textAlign:'right', flexShrink:0 }}>
                    {ITEM_LABELS[key] || key}
                  </span>
                  <div style={{ flex:1, background:'#F0F2F5', borderRadius:4, height:8 }}>
                    <div style={{
                      width: isOn ? `${(dispVal/fullTotal)*100}%` : '0%',
                      height:8, borderRadius:4,
                      background: isCustom ? '#E07B2A' : COLORS[i%COLORS.length],
                      transition:'width 0.3s',
                    }} />
                  </div>
                  <span style={{ fontSize:11, fontFamily:'monospace', width:52, color: isCustom?'#E07B2A':'#1F3A5F', flexShrink:0 }}>
                    {isOn ? fmt(dispVal) : '—'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing engine details */}
          <div style={{ background:'#FFFFFF', border:'1px solid #DDE3EC', borderRadius:10, padding:16, boxShadow:'0 1px 3px rgba(31,58,95,0.06)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#1F3A5F', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>
              Pricing engine
            </div>
            {[
              ['Region',         rehab.regionLabel],
              ['Labor mult',     `${rehab.laborMultiplier.toFixed(2)}×`],
              ['Age adjustment', `${ageMult} (${input.yearBuilt})`],
              ['Strategy',       input.exitStrategy.toUpperCase()],
              ['Finish level',   rehab.finishLevel],
              ['Contingency',    input.condition==='light'||input.condition==='moderate'?'10%':'15%'],
              ...(customCount > 0 ? [['Custom overrides', `${customCount} item${customCount!==1?'s':''} → all calcs updated`]] : []),
            ].map(([l, v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #F0F2F5', fontSize:13 }}>
                <span style={{ color:'#6B7C93' }}>{l}</span>
                <span style={{ fontWeight:600, color: l==='Custom overrides'?'#E07B2A':'#1F3A5F', textTransform:'capitalize' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
