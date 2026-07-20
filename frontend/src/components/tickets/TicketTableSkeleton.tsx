import { SkeletonContainer, SkeletonLoader } from '../common/SkeletonLoader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../common/Table';

const SKELETON_ROWS = 5;

const COLUMNS = [
  { label: 'Title', className: '' },
  { label: 'Priority', className: 'whitespace-nowrap' },
  { label: 'Status', className: 'whitespace-nowrap' },
  { label: 'Assigned To', className: 'hidden md:table-cell' },
  { label: 'Created', className: 'hidden lg:table-cell' },
] as const;

export function TicketTableSkeleton() {
  return (
    <SkeletonContainer label="Loading tickets">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column.label} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <TableRow key={index}>
              <TableCell>
                <SkeletonLoader className="h-4 w-32 max-w-full sm:w-48" />
              </TableCell>
              <TableCell>
                <SkeletonLoader className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <SkeletonLoader className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <SkeletonLoader className="h-4 w-28 max-w-full" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <SkeletonLoader className="h-4 w-36 max-w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SkeletonContainer>
  );
}
