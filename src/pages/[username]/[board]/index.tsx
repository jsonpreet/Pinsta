import Board from '@components/Board'
import { getBoardBySlug } from '@lib/db/api';

export default Board

export const getServerSideProps = async (ctx : any) => {
    const { board } = ctx.params;
    
    const response = await getBoardBySlug(board);

    return {
        props: {
            board: response[0]
        },
    }
}