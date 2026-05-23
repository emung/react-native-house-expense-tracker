import { Platform } from 'react-native';

/**
 * Shares/downloads a CSV string with the given filename.
 *
 * Web: creates a Blob and triggers a browser download via a temporary anchor.
 * Native (iOS/Android): writes a temp file via expo-file-system, then opens
 *   the native share sheet via expo-sharing.
 */
export async function shareCsv(csvContent: string, filename: string): Promise<void> {
  if (Platform.OS === 'web') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();

    // Small delay ensures the click is processed before revocation
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 100);

    return;
  }

  // Native path — dynamic imports keep these out of the web bundle entirely
  const [{ cacheDirectory, writeAsStringAsync, EncodingType }, { isAvailableAsync, shareAsync }] =
    await Promise.all([
      import('expo-file-system/legacy') as Promise<typeof import('expo-file-system/legacy')>,
      import('expo-sharing') as Promise<typeof import('expo-sharing')>,
    ]);

  const fileUri = `${cacheDirectory}${filename}`;
  await writeAsStringAsync(fileUri, csvContent, { encoding: EncodingType.UTF8 });

  const canShare = await isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device.');
  }

  await shareAsync(fileUri, {
    mimeType: 'text/csv',
    dialogTitle: 'Export expenses',
    UTI: 'public.comma-separated-values-text',
  });
}
