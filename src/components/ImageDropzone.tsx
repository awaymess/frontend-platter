'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Box, Typography, Stack } from '@awaymess/ui';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { UploadCloud, X } from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';

export type DeferredImageFile = {
  file: Blob;
  filename?: string;
};

interface ImageDropzoneProps {
  value: string;
  onChange: (url: string, file?: DeferredImageFile) => void;
  label?: string;
  maxSizeMB?: number;
  compressToMB?: number;
  uploadPath?: string;
  previewFit?: 'cover' | 'contain';
}

export default function ImageDropzone({
  value,
  onChange,
  label = 'อัปโหลดรูปภาพ',
  maxSizeMB = 3,
  compressToMB = 0.5,
  previewFit = 'cover',
}: ImageDropzoneProps) {
  const { mode } = useThemeMode();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setError('');

      // Check source image size before compression.
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`ไฟล์ใหญ่เกินไป (จำกัด ${maxSizeMB}MB)`);
        return;
      }

      setUploading(true);
      try {
        // Compress image to the configured upload target.
        const compressed = await imageCompression(file, {
          maxSizeMB: compressToMB,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        const previewUrl = URL.createObjectURL(compressed);
        onChange(previewUrl, { file: compressed, filename: file.name });
      } catch {
        setError('เตรียมรูปไม่สำเร็จ');
      }
      setUploading(false);
    },
    [maxSizeMB, compressToMB, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    disabled: uploading,
  });

  if (value) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block', width: 160, height: 160 }}>
        <Box
          sx={{
            position: 'relative',
            width: 160,
            height: 160,
            overflow: 'hidden',
            borderRadius: '16px',
            border: `2px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          <Box
            component="img"
            src={value}
            alt="Preview"
            sx={{ width: '100%', height: '100%', objectFit: previewFit }}
          />
        </Box>
        <IconButton
          size="small"
          onClick={() => onChange('')}
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            background: 'rgba(239,68,68,0.9)',
            color: '#fff',
            '&:hover': { background: '#ef4444' },
            width: 24,
            height: 24,
          }}
        >
          <X size={14} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${isDragActive ? '#007AFF' : mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
          borderRadius: '16px',
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: isDragActive
            ? mode === 'dark'
              ? 'rgba(30,102,241,0.1)'
              : 'rgba(30,102,241,0.05)'
            : 'transparent',
          '&:hover': {
            borderColor: '#007AFF',
            background: mode === 'dark' ? 'rgba(30,102,241,0.05)' : 'rgba(30,102,241,0.03)',
          },
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            <CircularProgress size={28} />
            <Typography variant="caption">กำลังบีบอัดรูป...</Typography>
          </Stack>
        ) : (
          <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
            <UploadCloud size={28} style={{ opacity: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isDragActive ? 'ปล่อยไฟล์ที่นี่' : label}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>
              ลาก & วาง หรือ คลิกเลือก (สูงสุด {maxSizeMB}MB, บีบอัดอัตโนมัติ)
            </Typography>
          </Stack>
        )}
      </Box>
      {error && (
        <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
