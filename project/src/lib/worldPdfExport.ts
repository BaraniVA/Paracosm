import jsPDF from 'jspdf';
import { supabase } from './supabase';

export interface WorldData {
  id: string;
  title: string;
  description: string;
  laws: string[];
  creator_id: string;
  created_at: string;
  parent_world?: {
    id: string;
    title: string;
    creator: {
      id: string;
      username: string;
    };
  };
}

export interface WorldRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

export interface TimelineEntry {
  id: string;
  era_title: string;
  year: string;
  event_title?: string;
  description: string;
  tag?: string;
  location?: string;
  roles_involved?: string[];
  is_private?: boolean;
  subnotes?: string[];
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Inhabitant {
  id: string;
  joined_at: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  role: {
    id: string;
    name: string;
  };
}

export interface ExportData {
  world: WorldData;
  records: WorldRecord[];
  timeline: TimelineEntry[];
  roles: Role[];
  inhabitants: Inhabitant[];
  canonScrolls: Array<{
    id: string;
    scroll_text: string;
    created_at: string;
    author: {
      id: string;
      username: string;
    };
  }>;
}

export class WorldPDFExporter {
  private pdf: jsPDF;
  private currentY: number = 30;
  private pageMargin: number = 20;
  private maxY: number = 270;

  constructor() {
    this.pdf = new jsPDF();
  }

  private checkPageBreak(height: number = 10): void {
    if (this.currentY + height > this.maxY) {
      this.pdf.addPage();
      this.currentY = 30;
    }
  }

  private addTitle(title: string, fontSize: number = 20): void {
    this.checkPageBreak(15);
    this.pdf.setFontSize(fontSize);
    this.pdf.setTextColor(0, 0, 0); // Black
    this.pdf.setFont('helvetica', 'bold');
    
    const pageWidth = this.pdf.internal.pageSize.getWidth();
    const textWidth = this.pdf.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;
    
    this.pdf.text(title, x, this.currentY);
    this.currentY += 20;
  }

  private addSectionTitle(title: string): void {
    this.checkPageBreak(15);
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.pageMargin, this.currentY);
    this.currentY += 15;
  }

  private addText(text: string, indent: number = 0): void {
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('helvetica', 'normal');
    
    const maxWidth = this.pdf.internal.pageSize.getWidth() - (this.pageMargin * 2) - indent;
    const lines = this.pdf.splitTextToSize(text, maxWidth);
    
    for (const line of lines) {
      this.checkPageBreak(6);
      this.pdf.text(line, this.pageMargin + indent, this.currentY);
      this.currentY += 6;
    }
    this.currentY += 5;
  }

  private addSimpleDivider(): void {
    this.checkPageBreak(10);
    const pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pdf.setLineWidth(0.5);
    this.pdf.setDrawColor(150, 150, 150);
    this.pdf.line(this.pageMargin, this.currentY, pageWidth - this.pageMargin, this.currentY);
    this.currentY += 15;
  }

  public async generateWorldPDF(exportData: ExportData): Promise<Blob> {
    const { world, records, timeline, canonScrolls } = exportData;
    
    // Title Page
    this.addTitle('WORLD ARCHIVE', 24);
    this.addTitle(world.title, 18);
    this.currentY += 10;
    
    // World Description
    this.addSectionTitle('Description');
    this.addText(world.description || 'No description provided');
    
    if (world.parent_world) {
      this.addText(`Forked from: ${world.parent_world.title} by ${world.parent_world.creator.username}`);
    }
    
    this.addText(`Created: ${new Date(world.created_at).toLocaleDateString()}`);
    this.addSimpleDivider();
    
    // World Laws
    if (world.laws && world.laws.length > 0) {
      this.addSectionTitle('World Laws');
      for (let i = 0; i < world.laws.length; i++) {
        this.addText(`${i + 1}. ${world.laws[i]}`);
      }
      this.addSimpleDivider();
    }
    
    // Timeline
    if (timeline.length > 0) {
      this.addSectionTitle('Timeline');
      
      // Group by era
      const timelineByEra = timeline.reduce((acc, entry) => {
        if (!acc[entry.era_title]) {
          acc[entry.era_title] = [];
        }
        acc[entry.era_title].push(entry);
        return acc;
      }, {} as Record<string, TimelineEntry[]>);
      
      for (const [era, entries] of Object.entries(timelineByEra)) {
        this.addText(`Era: ${era}`, 0);
        this.pdf.setFont('helvetica', 'bold');
        
        for (const entry of entries) {
          const title = entry.event_title ? `${entry.year} - ${entry.event_title}` : entry.year;
          this.addText(title, 5);
          this.addText(entry.description, 10);
          
          if (entry.location) this.addText(`Location: ${entry.location}`, 10);
          if (entry.tag) this.addText(`Tag: ${entry.tag}`, 10);
          if (entry.roles_involved && entry.roles_involved.length > 0) {
            this.addText(`Roles Involved: ${entry.roles_involved.join(', ')}`, 10);
          }
          if (entry.subnotes && entry.subnotes.length > 0) {
            this.addText(`Notes: ${entry.subnotes.join('; ')}`, 10);
          }
          this.currentY += 5;
        }
      }
      this.addSimpleDivider();
    }
    
    // World Records
    if (records.length > 0) {
      this.addSectionTitle('World Records');
      
      // Group by category
      const recordsByCategory = records.reduce((acc, record) => {
        if (!acc[record.category]) {
          acc[record.category] = [];
        }
        acc[record.category].push(record);
        return acc;
      }, {} as Record<string, WorldRecord[]>);
      
      for (const [category, categoryRecords] of Object.entries(recordsByCategory)) {
        this.addText(`Category: ${category}`, 0);
        this.pdf.setFont('helvetica', 'bold');
        
        for (const record of categoryRecords) {
          this.addText(record.title, 5);
          this.addText(record.description, 10);
          this.currentY += 5;
        }
      }
      this.addSimpleDivider();
    }
    
    // Canon Lore
    if (canonScrolls.length > 0) {
      this.addSectionTitle('Canon Lore');
      
      for (const scroll of canonScrolls) {
        this.addText(`By ${scroll.author.username} - ${new Date(scroll.created_at).toLocaleDateString()}`, 0);
        this.addText(scroll.scroll_text, 5);
        this.currentY += 10;
      }
    }
    
    // Footer
    this.currentY = this.maxY - 20;
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.setFont('helvetica', 'italic');
    const footerText = `Generated from Paracosm on ${new Date().toLocaleDateString()}`;
    const pageWidth = this.pdf.internal.pageSize.getWidth();
    const textWidth = this.pdf.getTextWidth(footerText);
    this.pdf.text(footerText, (pageWidth - textWidth) / 2, this.currentY);
    
    return this.pdf.output('blob');
  }
}

export async function fetchWorldExportData(worldId: string): Promise<ExportData> {
  try {
    // Fetch world data
    const { data: worldData, error: worldError } = await supabase
      .from('worlds')
      .select('*')
      .eq('id', worldId)
      .single();

    if (worldError) throw worldError;

    // Fetch parent world info if this is a fork
    let parent_world = null;
    if (worldData.origin_world_id) {
      const { data: parentWorldData } = await supabase
        .from('worlds')
        .select(`
          id,
          title,
          creator:users!creator_id(id, username)
        `)
        .eq('id', worldData.origin_world_id)
        .single();
      
      parent_world = parentWorldData;
    }

    // Fetch world records
    const { data: recordsData, error: recordsError } = await supabase
      .from('world_records')
      .select('id, title, description, category, created_at')
      .eq('world_id', worldId)
      .order('category', { ascending: true })
      .order('created_at', { ascending: true });

    if (recordsError) throw recordsError;

    // Fetch timeline entries
    const { data: timelineData, error: timelineError } = await supabase
      .from('timeline_entries')
      .select('id, era_title, year, event_title, description, tag, location, roles_involved, subnotes, created_at')
      .eq('world_id', worldId)
      .order('year', { ascending: true });

    if (timelineError) throw timelineError;

    // Fetch canon scrolls
    const { data: scrollsData, error: scrollsError } = await supabase
      .from('scrolls')
      .select(`
        id,
        scroll_text,
        created_at,
        author:users!author_id(id, username)
      `)
      .eq('world_id', worldId)
      .eq('is_canon', true)
      .order('created_at', { ascending: true });

    if (scrollsError) throw scrollsError;

    return {
      world: { ...worldData, parent_world },
      records: recordsData || [],
      timeline: timelineData || [],
      roles: [], // Not needed for PDF
      inhabitants: [], // Not needed for PDF
      canonScrolls: (scrollsData || []).map(scroll => ({
        id: scroll.id,
        scroll_text: scroll.scroll_text,
        created_at: scroll.created_at,
        author: Array.isArray(scroll.author) ? scroll.author[0] : scroll.author
      }))
    };
  } catch (error) {
    console.error('Error fetching world export data:', error);
    throw error;
  }
}
