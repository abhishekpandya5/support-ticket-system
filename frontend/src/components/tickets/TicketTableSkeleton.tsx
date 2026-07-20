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

const COLUMNS = ['Title', 'Priority', 'Status', 'Assigned To', 'Created'] as const;

export function TicketTableSkeleton() {
  return (
    <SkeletonContainer label="Loading tickets">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <TableRow key={index}>
              <TableCell>
                <SkeletonLoader className="h-4 w-48 max-w-full" />
              </TableCell>
              <TableCell>
                <SkeletonLoader className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <SkeletonLoader className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell>
                <SkeletonLoader className="h-4 w-32 max-w-full" />
              </TableCell>
              <TableCell>
                <SkeletonLoader className="h-4 w-36 max-w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SkeletonContainer>
  );
}
