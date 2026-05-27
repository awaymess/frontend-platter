'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Box, Stack, Typography } from '@awaymess/ui';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { UploadCloud, X } from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';
import type { DeferredImageFile } from './ImageDropzone';

export type MultiImageFileSlots = Array<DeferredImageFile | null>;

type MultiImageDropzoneProps = {
  values: string[];
  files: MultiImageFileSlots;
  onChange: (values: string[], files: MultiImageFileSlots) => void;
  label?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  compressToMB?: number;
  previewFit?: 'cover' | 'contain';
};

export default function MultiImageDropzone({
  values,
  files,
  onChange,
  label = 'ลากรูปมาวาง หรือคลิกเลือก',
  maxFiles = 3,
  maxSizeMB = 3,
  compressToMB = 0.5,
  previewFit = 'cover',
}: MultiImageDropzoneProps) {
  const { mode } = useThemeMode();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const imageValues = values.filter(Boolean).slice(0, maxFiles);
  const remainingSlots = Math.max(maxFiles - imageValues.length, 0);

  const removeAt = (index: number) => {
    const nextValues = [...imageValues];
    const nextFiles = [...files];
    nextValues.splice(index, 1);
    nextFiles.splice(index, 1);
    onChange(nextValues, nextFiles.slice(0, maxFiles));
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || remainingSlots <= 0) return;
    setError('');

    const selectedFiles = acceptedFiles.slice(0, remainingSlots);
    const oversized = selectedFiles.find((file) => file.size > maxSizeMB * 1024 * 1024);
    if (oversized) {
      setError(`ไฟล์ใหญ่เกินไป (จำกัด ${maxSizeMB}MB ต่อรูป)`);
      return;
    }

    setUploading(true);
    try {
      const nextValues = [...imageValues];
      const nextFiles = files.slice(0, imageValues.length);

      for (const file of selectedFiles) {
        const compressed = await imageCompression(file, {
          maxSizeMB: compressToMB,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        nextValues.push(URL.createObjectURL(compressed));
        nextFiles.push({ file: compressed, filename: file.name });
      }

      onChange(nextValues.slice(0, maxFiles), nextFiles.slice(0, maxFiles));
    } catch {
      setError('เตรียมรูปไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: remainingSlots,
    multiple: true,
    disabled: uploading || remainingSlots <= 0,
  });

  return (
    <Box>
      <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        {imageValues.map((image, index) => (
          <Box
            key={`${image}-${index}`}
            sx={{ position: 'relative', width: 160, height: 160, flex: '0 0 auto' }}
          >
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
                src={image}
                alt={`Preview ${index + 1}`}
                sx={{ width: '100%', height: '100%', objectFit: previewFit }}
              />
            </Box>
            <IconButton
              size="small"
              onClick={() => removeAt(index)}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'rgba(239,68,68,0.92)',
                color: '#fff',
                '&:hover': { background: '#ef4444' },
                width: 28,
                height: 28,
              }}
            >
              <X size={16} />
            </IconButton>
          </Box>
        ))}
        {remainingSlots > 0 && (
          <Box
            {...getRootProps()}
            sx={{
              width: { xs: '100%', sm: 220 },
              minWidth: { xs: '100%', sm: 220 },
              height: 160,
              flex: { xs: '1 1 100%', sm: '0 0 220px' },
              border: `2px dashed ${isDragActive ? '#007AFF' : mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
              borderRadius: '16px',
              px: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
                <CircularProgress size={26} />
                <Typography variant="caption">กำลังบีบอัดรูป...</Typography>
              </Stack>
            ) : (
              <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
                <UploadCloud size={28} style={{ opacity: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {isDragActive ? 'ปล่อยไฟล์ที่นี่' : label}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.55 }}>
                  เพิ่มได้อีก {remainingSlots} รูป
                </Typography>
              </Stack>
            )}
          </Box>
        )}
      </Stack>
      {error && (
        <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.75, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
