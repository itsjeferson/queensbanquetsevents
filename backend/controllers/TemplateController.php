<?php
require_once __DIR__ . '/../models/InvitationTemplate.php';
require_once __DIR__ . '/../helpers/response.php';

class TemplateController
{
    public function index(): void
    {
        $category = $_GET['category'] ?? null;
        sendResponse(['success' => true, 'data' => InvitationTemplate::all($category)]);
    }

    public function show(int $id): void
    {
        $template = InvitationTemplate::find($id);
        if (!$template) sendError('Template not found', 404);
        sendResponse(['success' => true, 'data' => $template]);
    }

    public function store(array $data): void
    {
        if (empty($data['template_name']) || empty($data['category'])) {
            sendError('template_name and category are required', 400);
        }
        $id = InvitationTemplate::create($data);
        sendResponse(['success' => true, 'data' => InvitationTemplate::find($id)], 201);
    }

    public function update(int $id, array $data): void
    {
        $template = InvitationTemplate::find($id);
        if (!$template) sendError('Template not found', 404);
        InvitationTemplate::update($id, $data);
        sendResponse(['success' => true, 'data' => InvitationTemplate::find($id)]);
    }
}
