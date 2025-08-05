import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DenunciaCard from './DenunciaCard';
import { Inertia } from '@inertiajs/inertia'; // Import Inertia directly

const KanbanBoard = ({ denuncias, onStatusChange, isReadOnly }) => {
    const statuses = ['Recibida', 'En Investigación', 'Resuelta', 'Cerrada'];

    const groupedDenuncias = statuses.reduce((acc, status) => {
        acc[status] = denuncias.filter(denuncia => denuncia.estado === status);
        return acc;
    }, {});

    const handleSuccess = () => {
        if (onStatusChange) {
            onStatusChange();
        }
    };

    const handleError = (errors) => {
        console.error("Error updating status:", errors);
        // Revert UI if update fails (more complex state management needed)
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const movedDenuncia = denuncias.find(d => d.id === parseInt(draggableId));
        if (!movedDenuncia) return;

        const newStatus = destination.droppableId;

        Inertia.patch(route('admin.denuncias.update', movedDenuncia.id), {
            estado: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: handleSuccess,
            onError: handleError,
        });
    };

    return (
        <DragDropContext onDragEnd={isReadOnly ? null : onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {statuses.map((status) => (
                    <Droppable droppableId={status} key={status} isDropDisabled={isReadOnly}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-gray-100 p-4 rounded-lg shadow-inner min-h-[200px]"
                            >
                                <h3 className="font-semibold text-lg mb-4 text-gray-700">{status} ({groupedDenuncias[status].length})</h3>
                                {groupedDenuncias[status].map((denuncia, index) => (
                                    <Draggable key={denuncia.id} draggableId={denuncia.id.toString()} index={index} isDragDisabled={isReadOnly}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {... (isReadOnly ? {} : provided.draggableProps)}
                                                {... (isReadOnly ? {} : provided.dragHandleProps)}
                                                className="mb-3"
                                            >
                                                <DenunciaCard denuncia={denuncia} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
