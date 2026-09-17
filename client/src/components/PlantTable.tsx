// client/src/components/PlantTable.tsx
import React, { useState, useMemo } from 'react';
import { Plant } from '../types';
import { 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  Eye, 
  ChevronRight
} from 'lucide-react';

interface PlantTableProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
}

export const PlantTable: React.FC<PlantTableProps> = ({ plants, onSelectPlant }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortField, setSortField] = useState<'id' | 'moisture' | 'height'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const filteredPlants = useMemo(() => {
    return plants
      .filter((p) => {
        const matchesSearch =
          p.plant_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.leafHealth.condition.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRow = selectedRow === 'All' || p.row === Number(selectedRow);
        const matchesStatus = selectedStatus === 'All' || p.status.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesRow && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'id') {
          comp = a.plant_id.localeCompare(b.plant_id);
        } else if (sortField === 'moisture') {
          comp = a.soil.moisture - b.soil.moisture;
        } else if (sortField === 'height') {
          comp = a.growth.currentHeight - b.growth.currentHeight;
        }
        return sortDirection === 'asc' ? comp : -comp;
      });
  }, [plants, searchQuery, selectedRow, selectedStatus, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredPlants.length / pageSize);
  const paginatedPlants = filteredPlants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusPill = (status: string) => {
    switch (status) {
      case 'Water Stress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Possible Disease':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Slow Growth':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Needs Inspection':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#EAEFEA]">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#0F172A] tracking-tight m-0">
            Plant Monitoring Collection
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            150 Arecanut palms across 10 rows. Click any plant to open its dossier.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#D1E2D7] shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#0F172A] text-white font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0F172A] text-white font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <span className="text-xs font-mono text-[#64748B]">
            <strong className="text-[#0F172A]">{filteredPlants.length}</strong> plants
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#EAEFEA] shadow-xs space-y-2.5 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-between text-xs font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Plant ID (e.g. P082)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F8FAF9] border border-[#E2ECE8] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-emerald-600 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Row Filter */}
            <select
              value={selectedRow}
              onChange={(e) => {
                setSelectedRow(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 sm:flex-none px-2.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#E2ECE8] text-[#334155] focus:outline-none focus:border-emerald-600"
            >
              <option value="All">All Rows (1-10)</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => (
                <option key={r} value={r}>Row {r}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 sm:flex-none px-2.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#E2ECE8] text-[#334155] focus:outline-none focus:border-emerald-600"
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy (137)</option>
              <option value="Water Stress">Water Stress (8)</option>
              <option value="Possible Disease">Possible Disease (3)</option>
              <option value="Slow Growth">Slow Growth (2)</option>
            </select>
          </div>
        </div>

        {/* Quick Presets on Mobile & Desktop */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 sm:pt-0">
          <button
            onClick={() => {
              setSearchQuery('P082');
              setSelectedRow('All');
              setSelectedStatus('All');
            }}
            className="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[10px] sm:text-[11px] font-semibold whitespace-nowrap cursor-pointer hover:bg-[#FDE68A]"
          >
            P082 (Water)
          </button>
          <button
            onClick={() => {
              setSearchQuery('P113');
              setSelectedRow('All');
              setSelectedStatus('All');
            }}
            className="px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3] text-[10px] sm:text-[11px] font-semibold whitespace-nowrap cursor-pointer hover:bg-[#FECDD3]"
          >
            P113 (Disease)
          </button>
        </div>
      </div>

      {/* MODE 1: CARD GRID VIEW (2 cols on mobile, up to 6 on wide screens) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {paginatedPlants.map((plant) => (
            <div
              key={plant.plant_id}
              onClick={() => onSelectPlant(plant)}
              className="bg-white rounded-2xl p-2.5 sm:p-3.5 border border-[#EAEFEA] hover:border-[#CBD5E1] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] cursor-pointer group vibe-card flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F7F5] border border-[#E2ECE8] mb-2 sm:mb-3 relative flex items-center justify-center p-1.5 sm:p-2">
                  <img
                    src={plant.images.fullPlant}
                    alt={`Plant ${plant.plant_id}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                    <span className={`text-[8px] sm:text-[9px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full border shadow-2xs ${getStatusPill(plant.status)}`}>
                      {plant.status === 'Possible Disease' ? 'Disease' : plant.status}
                    </span>
                  </div>
                </div>

                {/* Plant ID and Title */}
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="font-extrabold text-[#0F172A] text-xs sm:text-sm group-hover:text-emerald-700 transition-colors">
                    {plant.plant_id}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#64748B]">
                    R{plant.row} • P{plant.position}
                  </span>
                </div>

                {/* Soil & Height Specs */}
                <div className="space-y-0.5 sm:space-y-1 font-mono text-[10px] sm:text-[11px] text-[#475569] mt-1 sm:mt-2">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Moisture:</span>
                    <strong className={plant.soil.moisture < 28 ? 'text-amber-700 font-bold' : 'text-[#0F172A]'}>
                      {plant.soil.moisture}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Height:</span>
                    <strong className="text-[#0F172A]">{plant.growth.currentHeight}cm</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[#F0F4F1] flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                <span className="text-[#64748B] truncate max-w-[65px] sm:max-w-none">{plant.leafHealth.condition}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>Inspect</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-[#EAEFEA] bg-white shadow-2xs">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#FAFBF9] text-[#64748B] border-b border-[#EAEFEA]">
                <th className="py-3 px-3 sm:px-4">Plant ID</th>
                <th className="py-3 px-3 sm:px-4">Row</th>
                <th className="py-3 px-3 sm:px-4">Position</th>
                <th className="py-3 px-3 sm:px-4">Soil</th>
                <th className="py-3 px-3 sm:px-4">Growth</th>
                <th className="py-3 px-3 sm:px-4">Leaf Health</th>
                <th className="py-3 px-3 sm:px-4">Water</th>
                <th className="py-3 px-3 sm:px-4">Status</th>
                <th className="py-3 px-3 sm:px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F1] text-[#334155]">
              {paginatedPlants.map((plant) => (
                <tr
                  key={plant.plant_id}
                  onClick={() => onSelectPlant(plant)}
                  className="hover:bg-[#F8FAF9] transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold text-[#0F172A] group-hover:text-emerald-700">
                    {plant.plant_id}
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-[#64748B]">Row {plant.row}</td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-[#64748B]">Pos {plant.position}</td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                    <span className={`font-semibold ${plant.soil.condition === 'Dry' ? 'text-amber-700' : 'text-[#0F172A]'}`}>
                      {plant.soil.condition} ({plant.soil.moisture}%)
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                    <span className={`font-semibold ${plant.growth.condition === 'Slow' ? 'text-orange-700' : 'text-[#0F172A]'}`}>
                      {plant.growth.condition} ({plant.growth.currentHeight}cm)
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                    <span className={`font-semibold ${plant.leafHealth.condition === 'Abnormal' ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {plant.leafHealth.condition}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                    <span className={`font-semibold ${plant.water.requirement === 'Required' ? 'text-amber-700' : 'text-[#64748B]'}`}>
                      {plant.water.requirement}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusPill(plant.status)}`}>
                      {plant.status}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlant(plant);
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#F1F5F3] hover:bg-[#0F172A] text-[#334155] hover:text-white text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#64748B] pt-2">
          <span>
            Page {currentPage} of {totalPages} ({filteredPlants.length} total)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-full bg-white border border-[#D1E2D7] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-[#334155] cursor-pointer shadow-2xs"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-colors ${
                  currentPage === pg
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-white border border-[#D1E2D7] hover:bg-slate-50 text-[#475569]'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-full bg-white border border-[#D1E2D7] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-[#334155] cursor-pointer shadow-2xs"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
