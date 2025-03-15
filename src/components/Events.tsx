import { Calendar, CalendarPlus, Clock, MapPin } from "lucide-react";
import { Button } from "./ui/button";

const Events = () => {
  const events = [
    {
      id: 1,
      date: "2023-07-15",
      title: "Evento 1",
      description: "Descrição do Evento 1",
      location: "Local do Evento 1",
    },
    {
      id: 2,
      date: "2023-07-20",
      title: "Evento 2",
      description: "Descrição do Evento 2",
      location: "Local do Evento 2",
    }
  ];

  return (
    // Events Section
    <div className="bg-[#f7fafc] rounded-lg border border-[#d1d5db] shadow-md md:p-6 p-4 mb-6 text-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 font-main">
          <Calendar className="h-5 w-5 text-primary" />
          Eventos
        </h2>
        <Button className="bg-gray-100 hover:bg-gray-200 text-black font-tertiary">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Criar Evento
        </Button>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-700 font-main tracking-[1px]">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 font-tertiary">
                {event.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-tertiary">Data do evento</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-tertiary">{event.location}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4 font-tertiary">
              Você ainda não criou nenhum evento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
