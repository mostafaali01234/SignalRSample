using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SignalRSample.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicChatMessagesPrivateChatMessagesRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SenderId",
                table: "PublicChatMessages",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "RoomId",
                table: "PublicChatMessages",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "SenderId",
                table: "PrivateChatMessages",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ReceiverId",
                table: "PrivateChatMessages",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_PublicChatMessages_RoomId",
                table: "PublicChatMessages",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_PublicChatMessages_SenderId",
                table: "PublicChatMessages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_PrivateChatMessages_ReceiverId",
                table: "PrivateChatMessages",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_PrivateChatMessages_SenderId",
                table: "PrivateChatMessages",
                column: "SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_PrivateChatMessages_AspNetUsers_ReceiverId",
                table: "PrivateChatMessages",
                column: "ReceiverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PrivateChatMessages_AspNetUsers_SenderId",
                table: "PrivateChatMessages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PublicChatMessages_AspNetUsers_SenderId",
                table: "PublicChatMessages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PublicChatMessages_ChatRoom_RoomId",
                table: "PublicChatMessages",
                column: "RoomId",
                principalTable: "ChatRoom",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PrivateChatMessages_AspNetUsers_ReceiverId",
                table: "PrivateChatMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_PrivateChatMessages_AspNetUsers_SenderId",
                table: "PrivateChatMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_PublicChatMessages_AspNetUsers_SenderId",
                table: "PublicChatMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_PublicChatMessages_ChatRoom_RoomId",
                table: "PublicChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_PublicChatMessages_RoomId",
                table: "PublicChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_PublicChatMessages_SenderId",
                table: "PublicChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_PrivateChatMessages_ReceiverId",
                table: "PrivateChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_PrivateChatMessages_SenderId",
                table: "PrivateChatMessages");

            migrationBuilder.AlterColumn<string>(
                name: "SenderId",
                table: "PublicChatMessages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "RoomId",
                table: "PublicChatMessages",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SenderId",
                table: "PrivateChatMessages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReceiverId",
                table: "PrivateChatMessages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
