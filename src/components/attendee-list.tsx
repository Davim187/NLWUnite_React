import {
  Search,
  MoreHorizontal,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  ChevronRight,
} from "lucide-react";
import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { ChangeEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

export function Attendee_list() {
  const [inputSearch, setInputSearch] = useState(()=>{
    const url = new URL(window.location.toString())
    if(url.searchParams.has('search')){
      return url.searchParams.get('search') ?? ''
    }

    return ''
  });
  const [page, setPage] = useState(()=>{
    const url = new URL(window.location.toString())
    if(url.searchParams.has('page')){
      return Number(url.searchParams.get('page'))
    }

    return 1
  });

  const [total, setTotal] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const url = new URL(
      "http://localhost:3032/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees"
    );
    url.searchParams.set("pageIndex", String(page - 1));
    if (inputSearch.length > 0) {
      url.searchParams.set("query", inputSearch);
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAttendees(data.attendees);
        setTotal(data.total);
      });
  }, [page, inputSearch]);

  function setCurrentPage(page:number){
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({},'',url)
    setPage(page)
  }


  function setCurrentSeach(inputSearch:string){
    const url = new URL(window.location.toString())
    url.searchParams.set('search',inputSearch)
    window.history.pushState({},'',url)
    setInputSearch(inputSearch)
  }


  function onSerachInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSeach(event.target.value);
    setCurrentPage(1);
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }
  function goToPreviousPage() {
    setCurrentPage(page - 1);
  }

  function goToNextPage() {
    setCurrentPage(page + 1);
   
  }
  function goToLastPage() {
    setCurrentPage(page+1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center ">
        <h1 className="text-2xl font-bold ">Participantes</h1>
        <div className="px-2 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
          value={inputSearch}
            placeholder="Buscar Participantes..."
            className="bg-transparent outline-none flex-1 border-0 p-0 text-sm focus:ring-0"
            onChange={onSerachInputChanged}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr className=" border-b border-white/10">
            <TableHeader style={{ width: 38 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border border-white/10"
              />
            </TableHeader>
            <TableHeader>Codigo</TableHeader>
            <TableHeader>Participantes</TableHeader>
            <TableHeader>Data de Inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <tr
                key={attendee.id}
                className=" border-b border-white/10 hover:bg-white/5"
              >
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <span className="text-zinc-400">Não fez check-in</span>
                  ) : (
                    dayjs().to(attendee.checkedInAt)
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    transparent
                    children={<MoreHorizontal className="size-4" />}
                  />
                </TableCell>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className=" border-b border-white/10">
            <TableCell className="py-3 px-4 text-sm text-zinc-300" colSpan={3}>
              Mostrando {attendees.length} de {total}
            </TableCell>
            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Pagina {page} de {Math.ceil(total / 10)}
                </span>
                <div className="flex gap-1.5">
                  <IconButton
                    onClick={goToFirstPage}
                    disabled={page === 1}
                    children={<ChevronsLeft className="size-4" />}
                  />
                  <IconButton
                    onClick={goToPreviousPage}
                    disabled={page === 1}
                    children={<ChevronLeft className="size-4" />}
                  />
                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === Math.ceil(total / 10)}
                    children={<ChevronRight className="size-4" />}
                  />

                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === Math.ceil(total / 10)}
                    children={<ChevronsRight className="size-4" />}
                  />
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
