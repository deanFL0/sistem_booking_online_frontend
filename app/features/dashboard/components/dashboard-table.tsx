import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table";

type Column<T> = {
    key?: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
};

interface DashboardTableProps<T> {
    title: string;
    description: string;
    columns: Column<T>[];
    data: T[];
    emptyMessage?: string;
}

export function DashboardTable<T>({
    title,
    description,
    columns,
    data,
    emptyMessage = "Tidak ada data",
}: DashboardTableProps<T>) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full border overflow-hidden rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead key={String(column.key)}>
                                        {column.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, index) => (
                                    <TableRow key={index}>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={String(column.key)}
                                            >
                                                {column.render
                                                    ? column.render(row)
                                                    : String(
                                                        row[
                                                        column.key as keyof T
                                                        ] ?? ""
                                                    )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}