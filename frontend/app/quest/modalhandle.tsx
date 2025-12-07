    import  { useState } from 'react'
    import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    } from "@/components/ui/dialog";
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { Textarea } from "@/components/ui/textarea";
    import { updateQuestById } from '@/lib/quest';
    import { toast } from "sonner"


    const ModalHandle = ({ open, onClose, quest, onUpdated }: any) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [points, setPoints] = useState("");


        
    const handleUpdateSubmit = async () => {
        if (!quest) return;

        const updatedData = {
        title,
        description,
        difficulty,
        points: Number(points),
        };
  await updateQuestById(quest._id, updatedData);

        console.log("Updated Quest Data:", updatedData);

        // TODO: Add API call here
        // await updateQuest(quest._id, updatedData);
          toast.success("Quest updated successfully!");
        await onUpdated();
        onClose();
    };



    return (
        <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Edit Quest</DialogTitle>
            </DialogHeader>

            {/* Title */}
            <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Update title"
            className="mb-3"
            />

            {/* Description */}
            <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Update description"
            className="mb-3"
            />

            {/* Difficulty */}
            <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="mb-3">
                <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
            </Select>

            {/* Points */}
            <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="XP Reward"
            className="mb-4"
            />

            <Button onClick={handleUpdateSubmit} className="w-full bg-blue-500 hover:bg-blue-600">
            Save Changes
            </Button>
        </DialogContent>
        </Dialog>
    )
    }


    export default ModalHandle
