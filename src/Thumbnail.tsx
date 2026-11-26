import React from 'react';
import { AbsoluteFill } from 'remotion';
import thumbData from './data/thumbnail_data.json';

const PALETTES = {
  fintech: { bg: '#0D1117', card: '#161B22', accent: '#FF3B30', secondary: '#D29922', positive: '#2EA043', text: '#F0F6FC', muted: '#8B949E' },
  tech: { bg: '#0B132B', card: '#1C2541', accent: '#FF9F1C', secondary: '#00F5D4', positive: '#00F5D4', text: '#FFFFFF', muted: '#A0AEC0' },
};

export const ThumbnailTemplate: React.FC<{ variant: 'A' | 'B' | 'C' }> = ({ variant }) => {
  const p = thumbData.channel === 'tech' ? PALETTES.tech : PALETTES.fintech;
  return (
    <AbsoluteFill style={{ backgroundColor: p.bg, fontFamily: 'system-ui, sans-serif', color: p.text, padding: 64, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundImage: `radial-gradient(circle at 80% 20%, ${p.accent}22 0%, transparent 55%)` }}>
      {variant === 'A' && (<>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ backgroundColor: p.accent, color: '#FFF', fontSize: 34, fontWeight: 900, padding: '12px 28px', borderRadius: 8, letterSpacing: 2 }}>{thumbData.variantA.badge}</div>
          <div style={{ fontSize: 84, fontWeight: 900, color: p.accent, fontFamily: 'monospace' }}>{thumbData.variantA.metric}</div>
        </div>
        <svg width="1152" height="280" viewBox="0 0 1152 280">
          <polyline fill="none" stroke={p.positive} strokeWidth="12" points="20,220 220,180 420,110 620,60" />
          <polyline fill="none" stroke={p.accent} strokeWidth="14" points="620,60 760,210 940,245 1130,265" />
          <circle cx="620" cy="60" r="16" fill="#FFF" stroke={p.accent} strokeWidth="6" />
        </svg>
        <div style={{ fontSize: 108, fontWeight: 950, lineHeight: 1, letterSpacing: -2, textTransform: 'uppercase' }}>{thumbData.variantA.headline}</div>
      </>)}
      {variant === 'B' && (<>
        <div style={{ fontSize: 104, fontWeight: 950, lineHeight: 1, letterSpacing: -2, textTransform: 'uppercase' }}>{thumbData.variantB.headline}</div>
        <div style={{ backgroundColor: p.card, border: `3px solid ${p.muted}55`, borderRadius: 16, padding: 44, position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
          <div style={{ fontSize: 28, color: p.muted, fontFamily: 'monospace', marginBottom: 24 }}>{thumbData.variantB.docTitle}</div>
          <div style={{ backgroundColor: `${p.accent}33`, borderLeft: `10px solid ${p.accent}`, padding: '22px 28px', fontSize: 38, fontWeight: 800, fontFamily: 'monospace', color: '#FFF' }}>{thumbData.variantB.highlightLine}</div>
          <div style={{ position: 'absolute', right: 48, bottom: 24, border: `8px solid ${p.accent}`, color: p.accent, fontSize: 52, fontWeight: 900, padding: '8px 24px', borderRadius: 12, transform: 'rotate(-8deg)', letterSpacing: 4 }}>{thumbData.variantB.stamp}</div>
        </div>
      </>)}
      {variant === 'C' && (<>
        <div style={{ fontSize: 100, fontWeight: 950, lineHeight: 1, letterSpacing: -2, textTransform: 'uppercase', textAlign: 'center' }}>{thumbData.variantC.headline}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div style={{ flex: 1, backgroundColor: p.card, border: `4px solid ${p.secondary}`, borderRadius: 20, padding: 44, textAlign: 'center' }}>
            <div style={{ fontSize: 32, color: p.secondary, fontWeight: 800, marginBottom: 16 }}>{thumbData.variantC.leftLabel}</div>
            <div style={{ fontSize: 112, fontWeight: 950, fontFamily: 'monospace' }}>{thumbData.variantC.leftValue}</div>
          </div>
          <div style={{ fontSize: 88, fontWeight: 900, color: p.accent }}>→</div>
          <div style={{ flex: 1, backgroundColor: p.card, border: `4px solid ${p.accent}`, borderRadius: 20, padding: 44, textAlign: 'center' }}>
            <div style={{ fontSize: 32, color: p.accent, fontWeight: 800, marginBottom: 16 }}>{thumbData.variantC.rightLabel}</div>
            <div style={{ fontSize: 112, fontWeight: 950, fontFamily: 'monospace', color: p.accent }}>{thumbData.variantC.rightValue}</div>
          </div>
        </div>
      </>)}
    </AbsoluteFill>
  );
};
