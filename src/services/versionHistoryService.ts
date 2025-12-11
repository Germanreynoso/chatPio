import type {
  ContentVersion,
  VersionHistory,
  VersionMetadata,
  VersionContent,
  VersionSearchFilters,
  VersionComparison,
  VersionStatus
} from '../types/versionHistory';
import jsPDF from 'jspdf';

const STORAGE_KEY = 'udlp_version_history';

class VersionHistoryService {
  private getStoredHistories(): VersionHistory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading version history:', error);
      return [];
    }
  }

  private saveHistories(histories: VersionHistory[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(histories));
    } catch (error) {
      console.error('Error saving version history:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Save a new version
  saveVersion(
    contentId: string,
    content: VersionContent[],
    metadata: Omit<VersionMetadata, 'id' | 'versionNumber' | 'createdAt'>,
    formData?: any
  ): ContentVersion {
    const histories = this.getStoredHistories();
    let history = histories.find(h => h.contentId === contentId);

    if (!history) {
      history = {
        contentId,
        versions: [],
        lastModified: new Date().toISOString()
      };
      histories.push(history);
    }

    const versionNumber = history.versions.length + 1;
    const newVersion: ContentVersion = {
      metadata: {
        id: this.generateId(),
        versionNumber,
        createdAt: new Date().toISOString(),
        ...metadata
      },
      content: content,
      formData
    };

    history.versions.push(newVersion);
    history.lastModified = new Date().toISOString();

    this.saveHistories(histories);
    return newVersion;
  }

  // Get all versions for a content
  getVersions(contentId: string): ContentVersion[] {
    const histories = this.getStoredHistories();
    const history = histories.find(h => h.contentId === contentId);
    return history ? history.versions : [];
  }

  // Get all content histories
  getAllHistories(): VersionHistory[] {
    return this.getStoredHistories();
  }

  // Search versions with filters
  searchVersions(filters: VersionSearchFilters): ContentVersion[] {
    const allHistories = this.getStoredHistories();
    let allVersions: ContentVersion[] = [];

    allHistories.forEach(history => {
      allVersions.push(...history.versions);
    });

    return allVersions.filter(version => {
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const contentMatch = version.content.some(c =>
          c.content.toLowerCase().includes(keyword) ||
          c.title.toLowerCase().includes(keyword)
        );
        const metadataMatch = version.metadata.topic.toLowerCase().includes(keyword) ||
                             version.metadata.area.toLowerCase().includes(keyword);
        if (!contentMatch && !metadataMatch) return false;
      }

      if (filters.dateFrom) {
        if (new Date(version.metadata.createdAt) < new Date(filters.dateFrom)) return false;
      }

      if (filters.dateTo) {
        if (new Date(version.metadata.createdAt) > new Date(filters.dateTo)) return false;
      }

      if (filters.area && version.metadata.area !== filters.area) return false;
      if (filters.user && version.metadata.createdBy !== filters.user) return false;
      if (filters.format && !version.metadata.formats.includes(filters.format)) return false;
      if (filters.status && version.metadata.status !== filters.status) return false;

      return true;
    });
  }

  // Update version status
  updateVersionStatus(contentId: string, versionId: string, status: VersionStatus): boolean {
    const histories = this.getStoredHistories();
    const history = histories.find(h => h.contentId === contentId);
    if (!history) return false;

    const version = history.versions.find(v => v.metadata.id === versionId);
    if (!version) return false;

    version.metadata.status = status;

    if (status === 'published' && !version.metadata.publishedAt) {
      version.metadata.publishedAt = new Date().toISOString();
    } else if (status === 'archived' && !version.metadata.archivedAt) {
      version.metadata.archivedAt = new Date().toISOString();
    }

    history.lastModified = new Date().toISOString();
    this.saveHistories(histories);
    return true;
  }

  // Compare two versions
  compareVersions(version1: ContentVersion, version2: ContentVersion): VersionComparison {
    const differences = {
      added: [] as string[],
      removed: [] as string[],
      modified: [] as string[]
    };

    // Simple text comparison for now
    // In a real implementation, you'd use a proper diff library
    version1.content.forEach((content1, index) => {
      const content2 = version2.content[index];
      if (!content2) {
        differences.removed.push(`Removed: ${content1.title}`);
      } else if (content1.content !== content2.content) {
        differences.modified.push(`Modified: ${content1.title}`);
      }
    });

    version2.content.forEach((content2, index) => {
      if (!version1.content[index]) {
        differences.added.push(`Added: ${content2.title}`);
      }
    });

    return {
      version1,
      version2,
      differences
    };
  }

  // Export to PDF - generates and downloads actual PDF file
  exportToPDF(contentId: string, month?: string): void {
    const versions = this.getVersions(contentId);
    let filteredVersions = versions;

    if (month) {
      const [year, monthNum] = month.split('-');
      filteredVersions = versions.filter(v => {
        const date = new Date(v.metadata.createdAt);
        return date.getFullYear() === parseInt(year) && date.getMonth() === parseInt(monthNum) - 1;
      });
    }

    if (filteredVersions.length === 0) {
      alert('No hay versiones disponibles para exportar en el período seleccionado.');
      return;
    }

    // Create new PDF document
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number): number => {
      if (currentY + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      return currentY;
    };

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Historial de Versiones', margin, currentY);
    currentY += 15;

    // Content info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`ID de Contenido: ${contentId}`, margin, currentY);
    currentY += 8;
    pdf.text(`Período: ${month || 'Todo el período'}`, margin, currentY);
    currentY += 8;
    pdf.text(`Total de versiones: ${filteredVersions.length}`, margin, currentY);
    currentY += 8;
    pdf.text(`Fecha de exportación: ${new Date().toLocaleString('es-ES')}`, margin, currentY);
    currentY += 15;

    // Add line separator
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Process each version
    filteredVersions.forEach((version, index) => {
      // Check if we need space for this version (estimate)
      const estimatedSpace = 60 + (version.content.length * 30);
      currentY = checkNewPage(estimatedSpace);

      // Version header
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Versión ${version.metadata.versionNumber}`, margin, currentY);
      currentY += 8;

      // Version metadata
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const metadata = [
        `Fecha: ${new Date(version.metadata.createdAt).toLocaleString('es-ES')}`,
        `Usuario: ${version.metadata.createdBy}`,
        `Estado: ${version.metadata.status === 'draft' ? 'Borrador' : version.metadata.status === 'published' ? 'Publicado' : 'Archivado'}`,
        `Área: ${version.metadata.area}`,
        `Formatos: ${version.metadata.formats.join(', ')}`,
        version.metadata.wordCount ? `Palabras: ${version.metadata.wordCount}` : null,
        version.metadata.audience ? `Audiencia: ${version.metadata.audience}` : null,
        version.metadata.isRefinement ? 'Tipo: Versión refinada' : 'Tipo: Versión original'
      ].filter(Boolean);

      metadata.forEach(line => {
        if (line) {
          currentY = checkNewPage(8);
          pdf.text(line, margin + 5, currentY);
          currentY += 6;
        }
      });

      currentY += 5;

      // Version content
      version.content.forEach((content, contentIndex) => {
        currentY = checkNewPage(40);

        // Content title
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${content.title} (${content.format})`, margin + 5, currentY);
        currentY += 8;

        // Content text
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const maxWidth = pageWidth - margin * 2 - 10;
        currentY = addWrappedText(content.content, margin + 5, currentY, maxWidth, 9);

        // Audio indicator
        if (content.audioUrl) {
          currentY = checkNewPage(8);
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 255);
          pdf.text('🎵 Contenido incluye audio generado', margin + 5, currentY);
          pdf.setTextColor(0, 0, 0);
          currentY += 6;
        }

        currentY += 8;
      });

      // Form data if available
      if (version.formData) {
        currentY = checkNewPage(30);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Datos del formulario original:', margin + 5, currentY);
        currentY += 8;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const formData = [
          version.formData.tema ? `Tema: ${version.formData.tema}` : null,
          version.formData.mensaje ? `Mensaje: ${version.formData.mensaje}` : null,
          version.formData.contexto ? `Contexto: ${version.formData.contexto}` : null,
          version.formData.audiencia ? `Audiencia: ${version.formData.audiencia}` : null
        ].filter(Boolean);

        formData.forEach(line => {
          if (line) {
            currentY = checkNewPage(8);
            currentY = addWrappedText(line, margin + 10, currentY, pageWidth - margin * 2 - 15, 9);
            currentY += 2;
          }
        });
      }

      // Separator between versions
      if (index < filteredVersions.length - 1) {
        currentY = checkNewPage(15);
        pdf.setLineWidth(0.3);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;
      }
    });

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth - 40, pageHeight - 10);
      pdf.text('Generado por Pío - Centro de Comunicación Inteligente', margin, pageHeight - 10);
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `historial-versiones-${contentId}-${timestamp}.pdf`;

    // Download the PDF
    pdf.save(filename);
  }

  // Get statistics
  getStatistics() {
    const histories = this.getStoredHistories();
    const allVersions: ContentVersion[] = [];
    histories.forEach(h => allVersions.push(...h.versions));

    return {
      totalContents: histories.length,
      totalVersions: allVersions.length,
      publishedVersions: allVersions.filter(v => v.metadata.status === 'published').length,
      draftVersions: allVersions.filter(v => v.metadata.status === 'draft').length,
      archivedVersions: allVersions.filter(v => v.metadata.status === 'archived').length,
      versionsByArea: allVersions.reduce((acc, v) => {
        acc[v.metadata.area] = (acc[v.metadata.area] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      versionsByUser: allVersions.reduce((acc, v) => {
        acc[v.metadata.createdBy] = (acc[v.metadata.createdBy] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Clear all data (for testing)
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const versionHistoryService = new VersionHistoryService();